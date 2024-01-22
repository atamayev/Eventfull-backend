import { Types } from "mongoose"
import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import NotificationHelper from "../../../../classes/notification-helper"
import createGroupMessageStatuses from "../../../../utils/chat/create-group-message-statuses"

interface ReplyToGroupChatData {
    groupChatId?: Types.ObjectId
    senderDetails: SocialData
    text: string
	groupMessageId?: Types.ObjectId
	replyTo: Types.ObjectId
	messageStatuses: MessageStatusObjectNoTimestamps[]
}

export default async function replyToGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const friends = req.friends
		const user = req.user
		const groupMessageReplyingTo = req.groupMessage
		const groupChat = req.groupChat
		const message = req.body.groupMessage as string

		const messageStatuses = createGroupMessageStatuses(groupChat.participantDetails)
		const data: ReplyToGroupChatData = {
			groupChatId: groupChat._id,
			senderDetails: {
				userId: user._id,
				username: user.username || "User",
			},
			text: message,
			replyTo: groupMessageReplyingTo._id,
			messageStatuses
		}
		const groupMessage = await GroupMessageModel.create(data)

		delete data.groupChatId

		data.groupMessageId = groupMessage._id
		await GroupChatModel.findByIdAndUpdate(
			groupChat._id,
			{ $set: { lastMessage: data } }
		)

		await NotificationHelper.replyToGroupMessage(friends, groupMessage)

		return res.status(200).json({ groupMessage })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Reply to Group Message" })
	}
}
