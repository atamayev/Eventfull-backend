import _ from "lodash"
import { Response, Request } from "express"
import { calendar_v3 } from "googleapis"
import getValidGoogleCalendarAccessToken from "../../../utils/google/calendar/calendar-retrieval/get-valid-google-calendar-token"
import convertGoogleToUnified from "../../../utils/google/calendar/calendar-retrieval/convert-google-to-unified"
import saveOrUpdateUserCalendarEvents from "../../../utils/save-or-update-incoming-calendar-data"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"

export default async function getGoogleCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		//move this to middleware, similar to microsoft's get-microsoft-calendar-details.ts
		const googleCalendarAccessToken = await getValidGoogleCalendarAccessToken(userId)
		if (_.isUndefined(googleCalendarAccessToken)) {
			return res.status(400).json({ error: "No Google Calendar Access Token Found" })
		}

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
