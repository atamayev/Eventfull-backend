import { Response, Request } from "express"
import deleteDBCalendarEvent from "../../../utils/calendar-misc/delete-db-calendar-event"
import createGoogleCalendarClient from "../../../utils/google/calendar/create-google-calendar-client"

export default async function deleteGoogleCalendarEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const googleCalendarAccessToken = req.headers.googleCalendarAccessToken as string

		const eventId: string = req.params.calendarId

		const googleClient = createGoogleCalendarClient(googleCalendarAccessToken)

		await googleClient.events.delete({
			calendarId: "primary",
			eventId: eventId
		})

		await deleteDBCalendarEvent(user._id, eventId, "hard")

		return res.status(200).json()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to Delete Google Calendar event" })
	}
}
