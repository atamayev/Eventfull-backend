import { Response, Request } from "express"
import { v4 as uuidv4 } from "uuid"
import addLocalCalendarEventToDB from "../../utils/local calendar/add-local-calendar-event-to-db"

export default async function addLocalCalendarData(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent[]

		calendarDetails.map((event: UnifiedCalendarEvent) => {
			event.id = uuidv4(),
			event.source = "local"
		})

		await addLocalCalendarEventToDB(userId, calendarDetails)

		return res.status(200).json({ message: "Successfully added calendar data" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to add calendar data" })
	}
}
