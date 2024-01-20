import { Request, Response } from "express"

export default function retrieveSingleGroupMessage(req: Request, res: Response): Response {
	try {
		const groupMessage = req.groupMessage

		return res.status(200).json({ groupMessage })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Group Message Chats" })
	}
}
