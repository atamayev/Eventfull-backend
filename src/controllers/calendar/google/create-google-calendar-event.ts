import _ from "lodash"
import { google } from "googleapis"
import { Response, Request } from "express"
import getValidGoogleCalendarAccessToken from "../../../utils/google/calendar-retrieval/get-valid-google-calendar-token"
import convertUnifiedToGoogleCalendarEvent from "../../../utils/google/convert-unified-to-google"

export default async function createGoogleCalendarEvent(req: Request, res: Response): Promise<Response> {
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

		await calendar.events.insert({
			calendarId: "primary",
			requestBody: googleEvent,
		})

		return res.status(200).json()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to Create Google Calendar event" })
	}
}
