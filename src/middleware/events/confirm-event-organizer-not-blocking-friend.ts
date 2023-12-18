import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"
import UserModel from "../../models/user-model"

export default async function confirmEventOrganizerNotBlockingFriend(
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

		const organizer = await UserModel.findById(event.organizerId)

		if (_.isNull(organizer)) return res.status(404).json({ error: "Event organizer not found" })
		const blockedUsers = organizer.blockedUsers.map(user => user.toString())

		if (blockedUsers.includes(friendId.toString())) {
			return res.status(403).json({ error: "You are blocked by the event organizer. Unable to attend event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
