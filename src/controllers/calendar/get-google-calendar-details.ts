import _ from "lodash"
import dayjs from "dayjs"
import { google } from "googleapis"
import { Response, Request } from "express"
import getValidGoogleCalendarAccessToken from "../../utils/google/calendar-retrieval/get-valid-google-calendar-token"
import { convertGoogleToUnified } from "../../utils/google/calendar-retrieval/convert-google-to-unified"
import { saveOrUpdateUserCalendarEvents } from "../../utils/save-or-update-incoming-calendar-data"

export default async function getGoogleCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const googleCalendarAccessToken = await getValidGoogleCalendarAccessToken(userId)
		if (_.isUndefined(googleCalendarAccessToken)) {
			return res.status(400).json({ error: "No Google Calendar Access Token Found" })
		}

		const oauth2Client = new google.auth.OAuth2()
		oauth2Client.setCredentials({ access_token: googleCalendarAccessToken })

		const calendar = google.calendar({ version: "v3", auth: oauth2Client })

		const startOfMonth = dayjs().startOf("month").toISOString()

		const events = await calendar.events.list({
			calendarId: "primary",
			timeMin: startOfMonth
		})

		const calendarDetails = events.data.items as GoogleCalendarEvent[]
		const unifiedGoogleCalendarDetails = convertGoogleToUnified(calendarDetails)
		await saveOrUpdateUserCalendarEvents(userId, unifiedGoogleCalendarDetails)

		return res.status(200).json({ calendarDetails: unifiedGoogleCalendarDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch Google Calendar data" })
	}
}
