import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function confirmUserIsEventOrganizerOrCohost(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string

		const event = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		if (_.isEqual(userId, event.organizerId)) {
			req.organizerOrCoHost = "Organizer"
			next()
			return
		}
		const coHostIds = [...event.coHosts.map(coHost => coHost.userId.toString())]

		if (coHostIds.includes(userId.toString()) === false) {
			return res.status(403).json({ error: "You are not authorized to modify this event" })
		}

		req.organizerOrCoHost = "Co-Host"
		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
