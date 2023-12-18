import { Response, Request } from "express"
import createGraphClient from "../../../utils/microsoft/create-graph-client"
import convertUnifiedToMicrosoft from "../../../utils/microsoft/calendar/convert-unified-to-microsoft"
import updateUnifiedEventInDb from "../../../utils/calendar-misc/update-unified-event-in-db"

export default async function updateMicrosoftCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken as string

		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const microsoftClient = createGraphClient(microsoftCalendarAccessToken)

		const microsoftEvent = convertUnifiedToMicrosoft(calendarDetails)

		await microsoftClient.api(`/me/calendars/${calendarId}/events/${calendarDetails.id}`).patch(microsoftEvent)

		await updateUnifiedEventInDb(user, calendarDetails)

		return res.status(200).json()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to update Microsoft Calendar event" })
	}
}
