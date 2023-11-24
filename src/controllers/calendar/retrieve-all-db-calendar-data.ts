import _ from "lodash"
import { Response, Request } from "express"
import UserModel from "../../models/user-model"

export default async function retrieveAllDbCalendarData (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const user = await UserModel.findById(userId)
		if (_.isNil(user)) return res.status(400).json({ error: "User not found" })

		const activeCalendarDetails = user.calendarData.filter(event => event.isActive === true)

		return res.status(200).json({ calendarDetails: activeCalendarDetails })

	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch calendar data" })
	}
}
