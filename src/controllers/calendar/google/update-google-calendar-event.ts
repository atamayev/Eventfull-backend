import { Response, Request } from "express"
import convertUnifiedToGoogle from "../../../utils/google/calendar/convert-unified-to-google"
import updateUnifiedEventInDb from "../../../utils/update-unified-event-in-db"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"

export default async function updateGoogleCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const googleCalendarAccessToken = req.headers.googleCalendarAccessToken as string

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const googleEvent = convertUnifiedToGoogle(calendarDetails)

		const googleClient = createGoogleCalendarClient(googleCalendarAccessToken)

		const updatedEvent = await googleClient.events.update({
			calendarId: "primary",
			eventId: calendarDetails.id,
			requestBody: googleEvent
		})

		await updateUnifiedEventInDb(userId, calendarDetails)

		return res.status(200).json({ data: updatedEvent.data })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to Update Google Calendar event" })
	}
}
