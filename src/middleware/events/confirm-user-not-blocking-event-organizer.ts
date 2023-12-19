import { Request, Response, NextFunction } from "express"

export default function confirmUserNotBlockingEventOrganizer(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const eventOrganizer = req.eventOrganizer

		const blockedUsers = user.blockedUsers.map(user1 => user1.toString())

		if (blockedUsers.includes(eventOrganizer._id.toString())) {
			return res.status(403).json({ error: "You have blocked the event organizer. Unable to attend event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Internal Server Error: Unable to Verify if User Blocking Event Organizer." })
	}
}
