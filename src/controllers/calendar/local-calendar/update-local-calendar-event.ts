import { Request, Response } from "express"
import updateUnifiedEventInDb from "../../../utils/update-unified-event-in-db"

export default async function updateLocalCalendarEvent (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		await updateUnifiedEventInDb(userId, calendarDetails)

		return res.status(200).json()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to update calendar data" })
	}
}
