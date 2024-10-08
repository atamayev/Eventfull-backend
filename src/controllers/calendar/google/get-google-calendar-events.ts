import { calendar_v3 } from "@googleapis/calendar"
import { Response, Request } from "express"
import saveIncomingUnifiedCalendarEvents from "../../../utils/calendar-misc/save-incoming-unified-calendar-events"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"
import convertGoogleToUnified from "../../../utils/google/calendar/calendar-retrieval/convert-google-to-unified"

export default async function getGoogleCalendarEvents(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const googleCalendarAccessToken = req.headers.googleCalendarAccessToken as string

		const googleClient = createGoogleCalendarClient(googleCalendarAccessToken)

		const events = await googleClient.events.list({
			calendarId: "primary"
		})

		const calendarDetails = events.data.items as calendar_v3.Schema$Event[]
		const unifiedCalendarEvents = convertGoogleToUnified(calendarDetails)
		await saveIncomingUnifiedCalendarEvents(user, unifiedCalendarEvents, "Google")

		return res.status(200).json({ calendarEvents: unifiedCalendarEvents })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to fetch Google Calendar Data" })
	}
}
