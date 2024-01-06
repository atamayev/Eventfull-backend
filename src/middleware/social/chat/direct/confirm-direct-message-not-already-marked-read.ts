import { Request, Response, NextFunction } from "express"

export default function confirmDirectMessageNotAlreadyMarkedRead(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const directMessage = req.directMessage

		if (directMessage.readByOtherUser === true) {
			return res.status(400).json({ message: "Message already marked as read" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if Message has already been marked as read" })
	}
}