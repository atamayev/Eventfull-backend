import { google, calendar_v3 } from "googleapis"

export default function createGoogleCalendarClient(accessToken: string): calendar_v3.Calendar {
	const oauth2Client = new google.auth.OAuth2()
	oauth2Client.setCredentials({ access_token: accessToken })

	return google.calendar({ version: "v3", auth: oauth2Client })
}
