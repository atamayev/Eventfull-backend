import { Request, Response, NextFunction } from "express"

export default function confirmMessageSentByUser(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const directMessage = req.directMessage

		if (user._id.equals(directMessage.senderId) === false) {
			return res.status(400).json({ message: "You did not send this message" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User sent this message" })
	}
}