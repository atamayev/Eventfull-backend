import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"
import { extractPrivateChatFriendId } from "../../../../utils/social/chat/extract-friend-ids"

export default async function deletePrivateMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const privateChat = req.privateChat
		const privateMessage = req.privateMessage

		const deletedPrivateMessage = await PrivateMessageModel.findByIdAndUpdate(
			privateMessage._id,
			{ $set:
				{ isActive: false }
			}, { new: true }
		)

		if (!_.isNull(privateChat.lastMessage)) {
			if (_.isEqual(privateChat.lastMessage.privateMessageId, privateMessage._id)) {
				await PrivateChatModel.findByIdAndUpdate(
					privateChat._id,
					{
						"lastMessage.isActive": false,
					}
				)
			}
		}

		if (_.isNull(deletedPrivateMessage)) return res.status(500).json({ error: "Unable to Delete Private Message" })

		const friendId = extractPrivateChatFriendId(privateChat, user._id)

		NotificationHelper.deletePrivateMessage(friendId, deletedPrivateMessage)

		return res.status(200).json({ success: "Private Message Deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Private Message" })
	}
}
