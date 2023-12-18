import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../models/user-model"

export default async function confirmEventOrganizerNotBlockingFriend(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const friend = req.friend
		const event = req.event

		const organizer = await UserModel.findById(event.organizerId)

		if (_.isNull(organizer)) return res.status(404).json({ error: "Event organizer not found" })
		const blockedUsers = organizer.blockedUsers.map(user => user.toString())

		if (blockedUsers.includes(friend._id.toString())) {
			return res.status(403).json({ error: "You are blocked by the event organizer. Unable to attend event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
