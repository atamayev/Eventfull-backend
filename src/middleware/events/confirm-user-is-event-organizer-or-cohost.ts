import _ from "lodash"
import { Types } from "mongoose"
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
		const objectEventId = new Types.ObjectId(eventfullEventId)

		const event = await EventfullEventModel.findById(objectEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		const authorizedUserIds = [event.organizerId.toString(), ...event.coHosts.map(coHost => coHost.toString())]

		if (authorizedUserIds.includes(userId.toString()) === false) {
			return res.status(403).json({ error: "You are not authorized to modify this event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}