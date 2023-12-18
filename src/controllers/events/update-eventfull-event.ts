import { Request, Response } from "express"
import addCohosts from "../../utils/events/add-cohosts"
import addInvitees from "../../utils/events/add-invitees"

export default async function updateEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const event = req.event
		const updatedEventData  = req.body.eventfullEventData as IncomingEventfullEvent
		const organizerOrCoHost = req.organizerOrCoHost as "Organizer" | "Co-Host"

		await addInvitees(userId, event._id, event, updatedEventData)

		if (organizerOrCoHost === "Organizer") {
			await addCohosts(userId, event._id, event, updatedEventData)
		}

		return res.status(200).json({ message: "Event Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
