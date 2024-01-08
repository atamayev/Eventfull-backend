import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import { extractGroupChatFriendIds } from "../../../../utils/social/chat/extract-friend-ids"

export default async function updateGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const oldGroupMessage = req.groupMessage
		const updatedMessageText = req.body.updatedMessageText

		const updatedGroupMessage = await GroupMessageModel.findByIdAndUpdate(
			oldGroupMessage._id,
			{ $set:
				{
					isTextEdited: true,
					text: updatedMessageText,
					readBy: []
				}
			}
		)

		if (!_.isNull(groupChat.lastMessage)) {
			if (_.isEqual(groupChat.lastMessage.groupMessageId, oldGroupMessage._id)) {
				await GroupChatModel.findByIdAndUpdate(
					groupChat._id,
					{
						"lastMessage.text": updatedMessageText,
						"lastMessage.isTextEdited": true,
						"lastMessage.readBy": [],
					}
				)
			}
		}

		if (_.isNull(updatedGroupMessage)) return res.status(500).json({ error: "Unable to Update Group Message" })

		const friendIds = extractGroupChatFriendIds(groupChat, user._id)

		NotificationHelper.updateGroupMessage(friendIds, updatedGroupMessage)

		return res.status(200).json({ success: "Group Message Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Group Message" })
	}
}
