import { Request, Response } from "express"
import convertAdminEventToEventfullEvent from "../../../utils/events/convert-admin-event-to-eventfull-event"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function addAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent

		// should do different things depending on event frequency
		const eventfullEvent = convertAdminEventToEventfullEvent(admin, eventfullEventData)

		const newEvent = await EventfullEventModel.create(eventfullEvent)

		return res.status(200).json({ eventId: newEvent._id.toString() })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
