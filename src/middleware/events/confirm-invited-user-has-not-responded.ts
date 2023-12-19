import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmInvitedUserHasNotResponded(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const friend = req.friend
		const event = req.event

		if (_.isEmpty(event.invitees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}

		const invitee = event.invitees.find(inv => inv.userId.toString() === friend._id.toString())

		if (_.isUndefined(invitee)) return res.status(403).json({ error: "User is not invited" })
		const attendee = event.attendees.find(attn => attn.userId.toString() === friend._id.toString())

		if (!_.isUndefined(attendee)) {
			return res.status(403).json({ error: "User is already attending the event" })
		} else if (invitee.attendingStatus === "Not Attending") {
			return res.status(403).json({ error: "User already declined the invitation" })
		} else {
			// invitee.attendingStatus === "Not Responded"
			next()
		}

	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm Invited User Not Responded" })
	}
}
