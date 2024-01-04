import { Request, Response } from "express"
import DirectMessageChatModel from "../../../models/chat/direct-message-chat-model"
import DirectMessageModel from "../../../models/chat/direct-message-model"

export default async function markDirectMessageAsRead(req: Request, res: Response): Promise<Response> {
	try {
		const chat = req.chat
		const directMessage = req.directMessage

		await DirectMessageModel.findByIdAndUpdate(
			directMessage._id,
			{ readByOtherUser: true }
		)

		if (directMessage._id.toString() === chat.lastMessage.messageId.toString()) {
			await DirectMessageChatModel.findByIdAndUpdate(
				chat._id,
				{ "lastMessage.readByOtherUser": true })
		}

		return res.status(200).json({ success: "Message Marked as Read" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Mark Message as Read" })
	}
}
