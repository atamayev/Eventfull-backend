import { v4 as uuidv4 } from "uuid"
import { Response, Request } from "express"
import UserModel from "../../../models/user-model"

export default async function addLocalCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		calendarDetails.id = uuidv4()
		calendarDetails.source = "local"
		calendarDetails.isActive = true
		calendarDetails.timeZone ||= "America/New_York"

		await UserModel.findByIdAndUpdate(
			user._id,
			{ $push: { calendarData: calendarDetails } },
			{ runValidators: true }
		)

		return res.status(200).json({ calendarId: calendarDetails.id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to add Calendar Data" })
	}
}
