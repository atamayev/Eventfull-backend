import { Types } from "mongoose"
import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import GroupMessageChatModel from "../../../../models/chat/group/group-chat-model"
import NotificationHelper from "../../../../classes/notification-helper"

interface ReplyToGroupChatData {
    groupChatId?: Types.ObjectId
    senderDetails: SocialData
    text: string
	groupMessageId?: Types.ObjectId
	replyTo: Types.ObjectId
}

export default async function replyToGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const friends = req.friends
		const user = req.user
		const groupMessageReplyingTo = req.groupMessage
		const groupMessageChat = req.groupChat
		const message = req.body.groupMessage as string

		const data: ReplyToGroupChatData = {
			groupChatId: groupMessageChat._id,
			senderDetails: {
				_id: user._id,
				username: user.username || "User",
			},
			text: message,
			replyTo: groupMessageReplyingTo._id
		}
		const groupMessage = await GroupMessageModel.create(data)

		delete data.groupChatId

		data.groupMessageId = groupMessage._id
		await GroupMessageChatModel.findByIdAndUpdate(
			groupMessageChat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		await NotificationHelper.replyToGroupMessage(friends, groupMessage)

		return res.status(200).json({ groupMessage })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Reply to Group Message" })
	}
}
