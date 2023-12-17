import _ from "lodash"
import { Request, Response } from "express"
import addCohosts from "../../utils/events/add-cohosts"
import addInvitees from "../../utils/events/add-invitees"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function updateEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string
		const updatedEventData  = req.body.eventfullEventData as IncomingEventfullEvent
		const organizerOrCoHost = req.organizerOrCoHost as "Organizer" | "Co-Host"

		const currentEvent = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(currentEvent)) return res.status(404).json({ error: "Event not found" })
		await addInvitees(userId, eventfullEventId, currentEvent, updatedEventData)

		if (organizerOrCoHost === "Organizer") {
			await addCohosts(userId, eventfullEventId, currentEvent, updatedEventData)
		}

		return res.status(200).json({ message: "Event Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
