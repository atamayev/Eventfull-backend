import { Request, Response } from "express"
import deleteDBCalendarEvent from "../../../utils/calendar-misc/delete-db-calendar-event"

export default async function deleteLocalCalendarEvent (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const calendarId: string = req.params.calendarId
		await deleteDBCalendarEvent(user._id, calendarId, "soft")

		return res.status(200).json({ message: "Calendar event deleted successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to delete calendar data" })
	}
}
