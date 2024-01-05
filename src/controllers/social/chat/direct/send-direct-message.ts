import { Types } from "mongoose"
import { Request, Response } from "express"
import DirectMessageModel from "../../../../models/chat/direct-message-model"
import DirectMessageChatModel from "../../../../models/chat/direct-message-chat-model"

interface ChatData {
    chatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	messageId?: Types.ObjectId
}

export default async function sendDirectMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const chat = req.directMessageChat
		const message = req.body.directMessage as string

		const data: ChatData = {
			chatId: chat._id,
			senderId: user._id,
			text: message
		}
		const directMessage = await DirectMessageModel.create(data)

		delete data.chatId
		data.messageId = directMessage._id
		await DirectMessageChatModel.findByIdAndUpdate(
			chat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		return res.status(200).json({ directMessageId: directMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Direct Message" })
	}
}
