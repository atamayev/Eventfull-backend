import { Request, Response, NextFunction } from "express"

export default function confirmPrivateMessageStatusIsNew(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const newPrivateMessageStatus = req.body.newMessageStatus
		const message = req.privateMessage
		if (message.messageStatus === newPrivateMessageStatus) {
			return res.status(400).json({ message: "Same Status" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if Message status is new" })
	}
}
