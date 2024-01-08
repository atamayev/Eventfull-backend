import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import { extractGroupChatFriendIds } from "../../../../utils/social/chat/extract-friend-ids"

export default async function markGroupMessageRead(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const groupMessage = req.groupMessage

		await GroupMessageModel.findByIdAndUpdate(
			groupMessage._id,
			{ $addToSet: { readBy: user._id } }
		)

		if (_.isNull(groupChat.lastMessage)) {
			return res.status(400).json ({ message: "No Last Message in the Group Chat Model"})
		}

		if (groupMessage._id.toString() === groupChat.lastMessage.groupMessageId.toString()) {
			await GroupChatModel.findByIdAndUpdate(
				groupChat._id,
				{ $addToSet: { "lastMessage.readBy": user._id } }
			)
		}

		const friendIds = extractGroupChatFriendIds(groupChat, user._id)

		NotificationHelper.markGroupMessageRead(
			user._id,
			friendIds,
			groupMessage
		)

		return res.status(200).json({ success: "Message Marked as Read" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Mark Message as Read" })
	}
}
