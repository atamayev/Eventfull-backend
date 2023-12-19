import { Request, Response, NextFunction } from "express"

export default function confirmInviterIsAlreadyInvitedOrHost(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const event = req.event

		const inviteesIds = event.invitees.map(invitee => invitee.userId.toString())
		const coHostIds = event.coHosts.map(coHost => coHost.userId.toString())
		inviteesIds.push(event.organizerId.toString())
		inviteesIds.push(...coHostIds)

		if (inviteesIds.includes(user._id.toString()) === false) {
			return res.status(403).json({ error: "You cannot invite someone to an event that you are not invited to" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm Inviter is Already Invited or Host" })
	}
}
