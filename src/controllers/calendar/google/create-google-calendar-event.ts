import { Response, Request } from "express"
import addGoogleEventToDb from "../../../utils/google/calendar/calendar-misc/add-google-event-to-db"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"
import convertUnifiedToGoogleCalendarEvent from "../../../utils/google/calendar/calendar-misc/convert-unified-to-google"

export default async function createGoogleCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const googleCalendarAccessToken = req.headers.googleCalendarAccessToken as string

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const googleEvent = convertUnifiedToGoogleCalendarEvent(calendarDetails)

		const googleClient = createGoogleCalendarClient(googleCalendarAccessToken)

		const response = await googleClient.events.insert({
			calendarId: "primary",
			requestBody: googleEvent,
		})

		calendarDetails.id = response.data.id || ""
		await addGoogleEventToDb(userId, calendarDetails)

		return res.status(200).json({ calendarId: calendarDetails.id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to Create Google Calendar event" })
	}
}
