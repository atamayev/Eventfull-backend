import { Request, Response, NextFunction } from "express"

export default function confirmEventOrganizerNotBlockingFriend(req: Request, res: Response,	next: NextFunction): void | Response {
	try {
		const friend = req.friend
		const eventOrganizer = req.eventOrganizer

		const blockedUsers = eventOrganizer.blockedUsers.map(user => user.userId.toString())

		if (blockedUsers.includes(friend._id.toString())) {
			return res.status(400).json({ message: "Your friend is blocked by the event organizer. Unable to invite friend" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify if Event Organizer is Blocking Friend" })
	}
}
