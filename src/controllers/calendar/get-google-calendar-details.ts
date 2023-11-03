import _ from "lodash"
import { Types } from "mongoose"
import { google } from "googleapis"
import { Response, Request } from "express"
import getValidGoogleLoginAccessToken from "../../utils/google/calendar-retrieval/get-valid-google-calendar-token"

export default async function getGoogleCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.headers.userid as string
		const googleCalendarAccessToken = await getValidGoogleLoginAccessToken(userId as unknown as Types.ObjectId)
		if (_.isUndefined(googleCalendarAccessToken)) {
			return res.status(400).json({ error: "No Google Calendar Access Token Found" })
		}

		const oauth2Client = new google.auth.OAuth2()
		oauth2Client.setCredentials({ access_token: googleCalendarAccessToken })

		const calendar = google.calendar({ version: "v3", auth: oauth2Client })

		const calendarList = await calendar.events.list({calendarId: "primary"})
		return res.status(200).json({ calendarDetails: calendarList.data.items })
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch Google Calendar data" })
	}
}
