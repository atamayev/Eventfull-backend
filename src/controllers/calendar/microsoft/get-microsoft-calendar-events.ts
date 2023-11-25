import { Response, Request } from "express"
import { Event } from "@microsoft/microsoft-graph-types"
import convertMicrosoftToUnified from "../../../utils/microsoft/calendar/calendar-retrieval/convert-microsoft-to-unified"
import saveIncomingUnifiedCalendarEvents from "../../../utils/save-incoming-unified-calendar-events"
import createGraphClient from "../../../utils/microsoft/create-graph-client"

export default async function getMicrosoftCalendarEvents(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken as string
		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const client = createGraphClient(microsoftCalendarAccessToken)

		const calendarDetails = await client.api(`/me/calendars/${calendarId}/events`).get() as { value: Event[] }
		const unifiedCalendarEvents = convertMicrosoftToUnified(calendarDetails.value)
		await saveIncomingUnifiedCalendarEvents(userId, unifiedCalendarEvents)

		return res.status(200).json({ calendarDetails: unifiedCalendarEvents })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch Microsoft Calendar data" })
	}
}
