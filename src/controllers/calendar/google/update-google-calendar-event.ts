import _ from "lodash"
import { google } from "googleapis"
import { Response, Request } from "express"
import getValidGoogleCalendarAccessToken from "../../../utils/google/calendar/calendar-retrieval/get-valid-google-calendar-token"
import convertUnifiedToGoogleCalendarEvent from "../../../utils/google/calendar/calendar-misc/convert-unified-to-google"
import updateGoogleEventInDb from "../../../utils/google/calendar/calendar-misc/update-google-event-in-db"

export default async function updateGoogleCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const googleCalendarAccessToken = await getValidGoogleCalendarAccessToken(userId)
		if (_.isUndefined(googleCalendarAccessToken)) {
			return res.status(400).json({ error: "No Google Calendar Access Token Found" })
		}

		const oauth2Client = new google.auth.OAuth2()
		oauth2Client.setCredentials({ access_token: googleCalendarAccessToken })

		const calendar = google.calendar({ version: "v3", auth: oauth2Client })

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const googleEvent = convertUnifiedToGoogleCalendarEvent(calendarDetails)

		const updatedEvent = await calendar.events.update({
			calendarId: "primary",
			eventId: calendarDetails.id,
			requestBody: googleEvent
		})

		await updateGoogleEventInDb(userId, calendarDetails)

		return res.status(200).json({ data: updatedEvent.data })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to Update Google Calendar event" })
	}
}
