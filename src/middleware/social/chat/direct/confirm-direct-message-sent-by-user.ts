import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmDirectMessageSentByUser(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const directMessage = req.directMessage

		if (!_.isEqual(user._id, directMessage.senderId)) {
			return res.status(400).json({ message: "You did not send this message" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User sent this message" })
	}
}
