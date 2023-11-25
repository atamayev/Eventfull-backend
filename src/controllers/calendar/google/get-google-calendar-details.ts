import { calendar_v3 } from "googleapis"
import { Response, Request } from "express"
import saveOrUpdateUserCalendarEvents from "../../../utils/save-or-update-incoming-calendar-data"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"
import convertGoogleToUnified from "../../../utils/google/calendar/calendar-retrieval/convert-google-to-unified"

export default async function getGoogleCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const googleCalendarAccessToken = req.headers.googleCalendarAccessToken as string

		const googleClient = createGoogleCalendarClient(googleCalendarAccessToken)

		const events = await googleClient.events.list({
			calendarId: "primary"
		})

		const calendarDetails = events.data.items as calendar_v3.Schema$Event[]
		const unifiedGoogleCalendarDetails = convertGoogleToUnified(calendarDetails)
		await saveOrUpdateUserCalendarEvents(userId, unifiedGoogleCalendarDetails)

		return res.status(200).json({ calendarDetails: unifiedGoogleCalendarDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch Google Calendar data" })
	}
}
