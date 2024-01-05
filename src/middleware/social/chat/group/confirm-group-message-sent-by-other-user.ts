import { Request, Response, NextFunction } from "express"

export default function confirmGroupMessageSentByOtherUser(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const groupMessage = req.groupMessage

		if (user._id.equals(groupMessage.senderId)) {
			return res.status(400).json({ message: "You cannot mark your own message as read" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User is a Chat Participant" })
	}
}
