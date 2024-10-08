import { Response, Request } from "express"
import addCloudEventToDb from "../../../utils/calendar-misc/add-cloud-event-to-db"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"
import convertUnifiedToGoogle from "../../../utils/google/calendar/convert-unified-to-google"

export default async function createGoogleCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const googleCalendarAccessToken = req.headers.googleCalendarAccessToken as string

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const googleEvent = convertUnifiedToGoogle(calendarDetails)

		const googleClient = createGoogleCalendarClient(googleCalendarAccessToken)

		const response = await googleClient.events.insert({
			calendarId: "primary",
			requestBody: googleEvent,
		})

		calendarDetails.id = response.data.id || ""
		await addCloudEventToDb(user._id, calendarDetails, "Google")

		return res.status(200).json({ calendarId: calendarDetails.id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Google Calendar Event" })
	}
}
