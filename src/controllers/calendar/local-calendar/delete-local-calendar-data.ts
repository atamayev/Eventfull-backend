import { Request, Response } from "express"
import deleteDBCalendarEvent from "../../../utils/delete-db-calendar-event"

export default async function deleteLocalCalendarData (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const calendarId: string = req.params.calendarId
		await deleteDBCalendarEvent(userId, calendarId, "soft")

		return res.status(200).json({ message: "Calendar event deleted successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to delete calendar data" })
	}
}
