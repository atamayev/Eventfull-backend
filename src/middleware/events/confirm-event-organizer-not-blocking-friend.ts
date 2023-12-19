import { Request, Response, NextFunction } from "express"

export default function confirmEventOrganizerNotBlockingFriend(req: Request, res: Response,	next: NextFunction): void | Response {
	try {
		const friend = req.friend
		const eventOrganizer = req.eventOrganizer

		const blockedUsers = eventOrganizer.blockedUsers.map(user => user.toString())

		if (blockedUsers.includes(friend._id.toString())) {
			return res.status(403).json({ error: "Your friend is blocked by the event organizer. Unable to invite friend" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Internal Server Error: Unable to Verify if Event Organizer is Blocking Friend" })
	}
}
