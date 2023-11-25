import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { Response, Request } from "express"
import UserModel from "../../../models/user-model"

export default async function addLocalCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const user = await UserModel.findById(userId)

		if (_.isNull(user)) return res.status(400).json({ message: "User Not found" })

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		calendarDetails.id = uuidv4(),
		calendarDetails.source = "local"
		calendarDetails.isActive = true
		calendarDetails.timeZone ||= "America/New_York"

		user.calendarData.push(calendarDetails)

		await user.save()

		return res.status(200).json({ calendarId: calendarDetails.id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to add calendar data" })
	}
}
