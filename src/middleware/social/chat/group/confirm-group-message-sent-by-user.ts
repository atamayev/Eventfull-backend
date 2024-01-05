import { Request, Response, NextFunction } from "express"

export default function confirmGroupMessageSentByUser(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const groupMessage = req.groupMessage

		if (user._id.equals(groupMessage.senderId) === false) {
			return res.status(400).json({ message: "You did not send this message" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User sent this message" })
	}
}
