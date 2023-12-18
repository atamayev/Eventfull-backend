import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function confirmInvitedUserHasNotResponded(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const friendId = req.friendId
		const eventfullEventId = req.body.eventfullEventId as string

		const event = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		if (_.isUndefined(event.invitees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}

		const invitee = event.invitees.find(inv => inv.userId.toString() === friendId.toString())

		if (_.isUndefined(invitee)) return res.status(403).json({ error: "User is not invited" })

		if (invitee.attendingStatus === "Not Attending") {
			return res.status(403).json({ error: "User already declined the invitation" })
		} else {
			// invitee.attendingStatus === "Not Responded"
			next()
		}

	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
