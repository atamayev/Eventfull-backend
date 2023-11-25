import { Response, Request } from "express"
import { Event } from "@microsoft/microsoft-graph-types"
import createGraphClient from "../../../utils/microsoft/create-graph-client"
import convertUnifiedToMicrosoft from "../../../utils/microsoft/calendar/convert-unified-to-microsoft"
import updateUnifiedEventInDb from "../../../utils/update-unified-event-in-db"

//Needs testing
export default async function updateMicrosoftCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken as string

		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const microsoftClient = createGraphClient(microsoftCalendarAccessToken)

		const microsoftEvent = convertUnifiedToMicrosoft(calendarDetails)

		const updatedEvent: Event = await microsoftClient.api(`/me/calendars/${calendarId}/events/${calendarDetails.id}`)
			.patch(microsoftEvent)

		await updateUnifiedEventInDb(userId, calendarDetails)

		return res.status(200).json({ data: updatedEvent })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to update Microsoft Calendar event" })
	}
}
