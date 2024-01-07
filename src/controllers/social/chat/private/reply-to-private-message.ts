import { Types } from "mongoose"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"

interface ReplyToChatData {
    privateChatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	privateMessageId?: Types.ObjectId
	replyTo: Types.ObjectId
}

export default async function replyToPrivateMessage(req: Request, res: Response): Promise<Response> {
	try {
		const friend = req.friend
		const user = req.user
		const privateMessageReplyingTo = req.privateMessage
		const privateChat = req.privateChat
		const repliedMessage = req.body.privateMessage as string

		const data: ReplyToChatData = {
			privateChatId: privateChat._id,
			senderId: user._id,
			text: repliedMessage,
			replyTo: privateMessageReplyingTo._id
		}
		const privateMessage = await PrivateMessageModel.create(data)

		delete data.privateChatId

		data.privateMessageId = privateMessage._id
		await PrivateChatModel.findByIdAndUpdate(
			privateChat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		await NotificationHelper.replyToPrivateMessage(
			user,
			friend,
			repliedMessage,
			privateChat._id,
			privateMessage._id,
			privateMessageReplyingTo._id
		)

		return res.status(200).json({ privateMessageId: privateMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Reply to Private Message" })
	}
}
