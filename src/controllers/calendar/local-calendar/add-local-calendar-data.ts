import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { Response, Request } from "express"
import UserModel from "../../../models/user-model"

export default async function addLocalCalendarData(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent[]

		calendarDetails.map((event: UnifiedCalendarEvent) => {
			event.id = uuidv4(),
			event.source = "local"
		})

		const user = await UserModel.findById(userId)

		if (_.isNil(user)) return res.status(400).json({ message: "User Not found" })

		for (const event of calendarDetails) {
			user.calendarData.push(event)
		}

		await user.save()

		return res.status(200).json({ message: "Successfully added calendar data" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to add calendar data" })
	}
}
