import { Types } from "mongoose"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"

interface ChatData {
    groupChatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	groupMessageId?: Types.ObjectId
}

export default async function sendGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const message = req.body.groupMessage as string

		const data: ChatData = {
			groupChatId: groupChat._id,
			senderId: user._id,
			text: message
		}
		const groupMessage = await GroupMessageModel.create(data)

		delete data.groupChatId
		data.groupMessageId = groupMessage._id

		await GroupChatModel.findByIdAndUpdate(
			groupChat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		await NotificationHelper.sendGroupMessage(
			groupChat.participants.filter(participantId => participantId !== user.id),
			groupMessage
		)

		return res.status(200).json({ groupMessageId: groupMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Group Message" })
	}
}
