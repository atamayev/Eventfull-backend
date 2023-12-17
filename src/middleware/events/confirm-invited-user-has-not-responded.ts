import _ from "lodash"
import { Types } from "mongoose"
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
		const objectEventId = new Types.ObjectId(eventfullEventId)

		const event = await EventfullEventModel.findById(objectEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		if (_.isUndefined(event.invitees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}

		const invitee = event.invitees.find(inv => inv.userId.toString() === friendId.toString())

		if (_.isUndefined(invitee)) return res.status(403).json({ error: "User is not invited" })

		if (invitee.attendingStatus === "Attending") {
			return res.status(403).json({ error: "User already accepted the invitation" })
		} else if (invitee.attendingStatus === "Not Attending") {
			return res.status(403).json({ error: "User already declined the invitation" })
		} else if (invitee.attendingStatus === "Co-Hosting") {
			return res.status(403).json({ error: "User is the event co-host" })
		} else if (invitee.attendingStatus === "Hosting") {
			return res.status(403).json({ error: "User is the event organizer" })
		} else {
			// invitee.attendingStatus === "Not Responded"
			next()
		}

	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
