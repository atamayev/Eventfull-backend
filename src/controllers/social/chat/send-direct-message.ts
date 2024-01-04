import { Types } from "mongoose"
import { Request, Response } from "express"
import DirectMessageModel from "../../../models/chat/direct-message-model"
import DirectMessageChatModel from "../../../models/chat/direct-message-chat-model"

interface ChatData {
    chatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
}

export default async function sendDirectMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const chat = req.chat
		const message = req.body.message as string

		const data: ChatData = {
			chatId: chat._id,
			senderId: user._id,
			text: message
		}
		await DirectMessageModel.create(data)

		delete data.chatId
		await DirectMessageChatModel.findByIdAndUpdate(
			chat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		return res.status(200).json({ success: "Direct Message Sent" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Direct Message" })
	}
}
