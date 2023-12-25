import { Request, Response, NextFunction } from "express"

export default function confirmEventOrganizerNotBlockingUser(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const eventOrganizer = req.eventOrganizer

		const blockedUsers = eventOrganizer.blockedUsers.map(user1 => user1.toString())

		if (blockedUsers.includes(user._id.toString())) {
			return res.status(400).json({ message: "You are blocked by the event organizer. Unable to attend event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify if Event Organizer is Blocking User" })
	}
}
