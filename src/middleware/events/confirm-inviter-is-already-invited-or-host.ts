import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function confirmInviterIsAlreadyInvitedOrHost(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string

		const event = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		if (_.isUndefined(event.invitees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}
		const inviteesIds = event.invitees.map(invitee => invitee.userId.toString())
		inviteesIds.push(event.organizerId.toString())
		const stringUserId = userId.toString()

		if (inviteesIds.includes(stringUserId) === false) {
			return res.status(403).json({ error: "You cannot invite someone to an event that you are not invited to" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
