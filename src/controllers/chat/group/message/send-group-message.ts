import { Types } from "mongoose"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"

interface ChatData {
	groupChatId?: Types.ObjectId
	senderDetails: SocialData
	text: string
	groupMessageId?: Types.ObjectId,
	messageStatuses: MessageStatusObjectNoTimestamps[]
}

export default async function sendGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const message = req.body.groupMessage as string
		const friends = req.friends

		const data: ChatData = {
			groupChatId: groupChat._id,
			senderDetails: {
				userId: user._id,
				username: user.username || "User",
			},
			text: message,
			messageStatuses: groupChat.participantDetails.map(participant => ({
				userId: participant.userId,
				messageStatus: "Sent", // Default status
				username: participant.username,
			})),
		}
		const groupMessage = await GroupMessageModel.create(data)

		delete data.groupChatId
		data.groupMessageId = groupMessage._id

		await GroupChatModel.findByIdAndUpdate(
			groupChat._id,
			{ $set: { lastMessage: data } }
		)

		await NotificationHelper.sendGroupMessage(friends, groupMessage)

		return res.status(200).json({ groupMessage })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Group Message" })
	}
}
