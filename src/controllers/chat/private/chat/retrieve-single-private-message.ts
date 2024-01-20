import { Request, Response } from "express"

export default function retrieveSinglePrivateMessage(req: Request, res: Response): Response {
	try {
		const privateMessage = req.privateMessage

		return res.status(200).json({ privateMessage })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Private Message Chats" })
	}
}
