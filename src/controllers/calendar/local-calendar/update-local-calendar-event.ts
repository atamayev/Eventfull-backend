import { Request, Response } from "express"
import updateUnifiedEventInDb from "../../../utils/calendar-misc/update-unified-event-in-db"

export default async function updateLocalCalendarEvent (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		await updateUnifiedEventInDb(user, calendarDetails)

		return res.status(200).json({ success: "Successfully updated calendar data" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Local Calendar Data" })
	}
}
