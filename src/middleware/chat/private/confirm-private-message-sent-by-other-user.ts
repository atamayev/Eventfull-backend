import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmPrivateMessageSentByOtherUser(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const privateMessage = req.privateMessage

		if (_.isEqual(user._id, privateMessage.senderDetails.userId)) {
			return res.status(400).json({ message: "You cannot mark your own message as read/delivered" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if the message was not sent by the same user" })
	}
}
