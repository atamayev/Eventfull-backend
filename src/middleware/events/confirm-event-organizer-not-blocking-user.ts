import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import findUser from "../../utils/find-user"

export default async function confirmEventOrganizerNotBlockingUser(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user

		const event = req.event

		const organizer = await findUser(event.organizerId)

		if (_.isNull(organizer)) return res.status(404).json({ error: "Event organizer not found" })
		const blockedUsers = organizer.blockedUsers.map(user1 => user1.toString())

		if (blockedUsers.includes(user._id.toString())) {
			return res.status(403).json({ error: "You are blocked by the event organizer. Unable to attend event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
