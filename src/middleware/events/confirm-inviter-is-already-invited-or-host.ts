import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmInviterIsAlreadyInvitedOrHost(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const event = req.event

		const inviteesIds = event.invitees.map(invitee => invitee.user.userId.toString())
		const coHostIds = event.coHosts.map(coHost => coHost.user.userId.toString())
		if (!_.isUndefined(event.organizer)) {
			inviteesIds.push(event.organizer.userId.toString())
		}
		inviteesIds.push(...coHostIds)

		if (inviteesIds.includes(user._id.toString()) === false) {
			return res.status(400).json({ message: "You cannot invite someone to an event that you are not invited to" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm Inviter is Already Invited or Host" })
	}
}
