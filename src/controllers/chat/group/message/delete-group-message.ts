import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import { extractGroupChatFriendIds } from "../../../../utils/social/chat/extract-friend-ids"

export default async function deleteGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const groupMessage = req.groupMessage

		const deletedGroupMessage = await GroupMessageModel.findByIdAndUpdate(
			groupMessage._id,
			{ $set:
				{ isActive: false }
			}, { new: true }
		)

		if (!_.isNull(groupChat.lastMessage)) {
			if (_.isEqual(groupChat.lastMessage.groupMessageId, groupMessage._id)) {
				await GroupChatModel.findByIdAndUpdate(
					groupChat._id,
					{
						"lastMessage.isActive": false,
					}
				)
			}
		}

		if (_.isNull(deletedGroupMessage)) return res.status(500).json({ error: "Unable to Delete Group Message" })

		const friendIds = extractGroupChatFriendIds(groupChat, user._id)

		NotificationHelper.deleteGroupMessage(friendIds, deletedGroupMessage)

		return res.status(200).json({ success: "Group Message Deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Group Message" })
	}
}
