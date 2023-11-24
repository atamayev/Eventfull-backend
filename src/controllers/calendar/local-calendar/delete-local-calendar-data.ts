import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function deleteLocalCalendarData (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const calendarId: string = req.params.calendarId

		const user = await UserModel.findById(userId)

		if (_.isNil(user)) return res.status(404).json({ error: "User not found" })

		const event = user.calendarData.find(calendarEvent => calendarEvent.id === calendarId)

		if (_.isNil(event)) return res.status(404).json({ error: "Calendar event not found" })

		event.isActive = false

		await user.save()

		return res.status(200).json({ message: "Calendar event deleted successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to delete calendar data" })
	}
}
