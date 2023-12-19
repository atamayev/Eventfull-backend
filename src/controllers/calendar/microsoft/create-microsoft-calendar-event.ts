import { Response, Request } from "express"
import { Event } from "@microsoft/microsoft-graph-types"
import addCloudEventToDb from "../../../utils/calendar-misc/add-cloud-event-to-db"
import createGraphClient from "../../../utils/microsoft/create-graph-client"
import convertUnifiedToMicrosoft from "../../../utils/microsoft/calendar/convert-unified-to-microsoft"

export default async function createMicrosoftCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken as string

		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const microsoftClient = createGraphClient(microsoftCalendarAccessToken)

		const microsoftEvent = convertUnifiedToMicrosoft(calendarDetails)

		const response: Event = await microsoftClient.api(`/me/calendars/${calendarId}/events`).post(microsoftEvent)

		calendarDetails.id = response.id || ""
		await addCloudEventToDb(user._id, calendarDetails, "microsoft")

		return res.status(200).json({ calendarId: calendarDetails.id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to create Microsoft Calendar event" })
	}
}
