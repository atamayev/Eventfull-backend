import { calendar_v3, calendar } from "@googleapis/calendar"
import { OAuth2Client } from "google-auth-library"

export default function createGoogleCalendarClient(accessToken: string): calendar_v3.Calendar {
	const oauth2Client = new OAuth2Client()
	oauth2Client.setCredentials({ access_token: accessToken })

	return calendar({ version: "v3", auth: oauth2Client })
}
