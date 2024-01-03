import { Request, Response } from "express"
import DirectMessageChatModel from "../../../models/direct-message-chat-model"

export default async function createDirectMessageChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		await DirectMessageChatModel.create({
			participants: [user._id, friend._id],
			createdAt: new Date(),
			updatedAt: new Date(),
			lastMessage: null,
		})

		return res.status(200).json({ success: "Direct Message Chat Created" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Chat" })
	}
}
