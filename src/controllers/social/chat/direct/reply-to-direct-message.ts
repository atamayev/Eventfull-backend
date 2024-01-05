import { Types } from "mongoose"
import { Request, Response } from "express"
import DirectMessageModel from "../../../../models/chat/direct/direct-message-model"
import DirectMessageChatModel from "../../../../models/chat/direct/direct-message-chat-model"

interface ReplyToChatData {
    directMessageChatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	directMessageId?: Types.ObjectId
	replyTo?: Types.ObjectId
}

export default async function replyToDirectMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const directMessageReplyingTo = req.directMessage
		const directMessageChat = req.directMessageChat
		const newMessage = req.body.directMessage as string

		const data: ReplyToChatData = {
			directMessageChatId: directMessageChat._id,
			senderId: user._id,
			text: newMessage,
			replyTo: directMessageReplyingTo._id
		}
		const directMessage = await DirectMessageModel.create(data)

		delete data.directMessageChatId
		delete data.replyTo
		data.directMessageId = directMessage._id
		await DirectMessageChatModel.findByIdAndUpdate(
			directMessageChat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		return res.status(200).json({ directMessageId: directMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Reply to Direct Message" })
	}
}
