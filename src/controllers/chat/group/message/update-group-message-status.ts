import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import { extractGroupChatFriendIds } from "../../../../utils/social/chat/extract-friend-ids"

// eslint-disable-next-line max-lines-per-function
export default async function updateGroupMessageStatus(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const groupMessage = req.groupMessage
		const newMessageStatus = req.body.newMessageStatus as "Delivered" | "Read"

		const updatedGroupMessage = await GroupMessageModel.findOneAndUpdate(
			{
				_id: groupMessage._id,
				"messageStatuses.userId": user._id
			},
			{ $set: { "messageStatuses.$.messageStatus": newMessageStatus }, },
			{ new: true }
		)

		if (_.isNull(updatedGroupMessage)) {
			return res.status(400).json({ message: "Unable to Update Group Message Status" })
		}

		if (_.isNull(groupChat.lastMessage)) {
			return res.status(400).json({ message: "No Last Message in the Group Chat Model"})
		}

		if (groupMessage._id.toString() === groupChat.lastMessage.groupMessageId.toString()) {
			await GroupChatModel.findByIdAndUpdate(
				groupChat._id,
				{
					$set: { "lastMessage.messageStatuses.$[elem].messageStatus": newMessageStatus }
				},
				{ arrayFilters: [{ "elem.userId": user._id }] }
			)
		}

		const friendIds = extractGroupChatFriendIds(groupChat, user._id)

		NotificationHelper.updateGroupMessageStatus(
			friendIds,
			updatedGroupMessage,
			newMessageStatus,
			user._id
		)

		return res.status(200).json({ success: `Message Marked ${newMessageStatus}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Message Status" })
	}
}
