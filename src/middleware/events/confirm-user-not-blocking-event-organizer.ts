import { Request, Response, NextFunction } from "express"

export default function confirmUserNotBlockingEventOrganizer(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const eventOrganizer = req.eventOrganizer

		const blockedUserIds = user.blockedUsers.map(blockedUser => blockedUser.userId.toString())

		if (blockedUserIds.includes(eventOrganizer._id.toString())) {
			return res.status(400).json({ message: "You have blocked the event organizer. Unable to attend event" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify if User Blocking Event Organizer." })
	}
}
