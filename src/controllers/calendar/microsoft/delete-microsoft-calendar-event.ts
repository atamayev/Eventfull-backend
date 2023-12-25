import { Response, Request } from "express"
import deleteDBCalendarEvent from "../../../utils/calendar-misc/delete-db-calendar-event"
import createGraphClient from "../../../utils/microsoft/create-graph-client"

export default async function deleteMicrosoftCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken as string

		const eventId: string = req.params.calendarId

		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const microsoftClient = createGraphClient(microsoftCalendarAccessToken)

		await microsoftClient.api(`/me/calendars/${calendarId}/events/${eventId}`).delete()

		await deleteDBCalendarEvent(user._id, eventId, "hard")

		return res.status(200).json({ success: "Successfully deleted Microsoft Calendar event" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to delete Microsoft Calendar event" })
	}
}
