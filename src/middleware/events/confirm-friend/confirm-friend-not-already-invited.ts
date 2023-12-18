import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function confirmFriendNotAlreadyInvited(
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
		const inviteesIds = event.invitees.map(invitee => invitee.userId.toString())
		inviteesIds.push(event.organizerId.toString())

		if (inviteesIds.includes(friendId.toString()) === true) {
			return res.status(403).json({ error: "Friend is already invited" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
