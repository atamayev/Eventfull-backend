import { Types } from "mongoose"
import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group-message-model"
import GroupMessageChatModel from "../../../../models/chat/group-message-chat-model"

interface ChatData {
    chatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	messageId?: Types.ObjectId
}

export default async function sendGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const chat = req.groupMessageChat
		const message = req.body.groupMessage as string

		const data: ChatData = {
			chatId: chat._id,
			senderId: user._id,
			text: message
		}
		const groupMessage = await GroupMessageModel.create(data)

		delete data.chatId
		data.messageId = groupMessage._id
		await GroupMessageChatModel.findByIdAndUpdate(
			chat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		return res.status(200).json({ groupMessageId: groupMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Group Message" })
	}
}
