import { Request, Response } from "express"
import deleteDBCalendarEvent from "../../../utils/calendar-misc/delete-db-calendar-event"

export default async function deleteLocalCalendarEvent (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const calendarId: string = req.params.calendarId
		await deleteDBCalendarEvent(user._id, calendarId, "soft")

		return res.status(200).json({ success: "Calendar event deleted successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Calendar data" })
	}
}
