import { Request, Response } from "express"
import DirectMessageModel from "../../../models/chat/direct-messages-model"

export default async function sendDirectMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const chat = req.chat
		const message = req.body.message as string

		await DirectMessageModel.create({
			chatId: chat._id,
			senderId: user._id,
			text: message,
			createdAt: new Date(),
		}, { runValidators: true })

		return res.status(200).json({ success: "Direct Message Sent" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Direct Message" })
	}
}
