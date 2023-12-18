import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmInviterIsAlreadyInvitedOrHost(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const event = req.event

		if (_.isEmpty(event.invitees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}
		const inviteesIds = event.invitees.map(invitee => invitee.userId.toString())
		inviteesIds.push(event.organizerId.toString())
		const stringUserId = user._id.toString()

		if (inviteesIds.includes(stringUserId) === false) {
			return res.status(403).json({ error: "You cannot invite someone to an event that you are not invited to" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
