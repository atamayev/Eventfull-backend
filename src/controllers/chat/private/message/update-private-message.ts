import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"
import { extractPrivateChatFriendId } from "../../../../utils/social/chat/extract-friend-ids"

export default async function updatePrivateMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const privateChat = req.privateChat
		const oldPrivateMessage = req.privateMessage
		const updatedMessageText = req.body.updatedMessageText

		const updatedPrivateMessage = await PrivateMessageModel.findByIdAndUpdate(
			oldPrivateMessage._id,
			{ $set:
				{
					isTextEdited: true,
					text: updatedMessageText,
					messageStatus: "Sent"
				}
			}, { new: true }
		)

		if (!_.isNull(privateChat.lastMessage)) {
			if (_.isEqual(privateChat.lastMessage.privateMessageId, oldPrivateMessage._id)) {
				await PrivateChatModel.findByIdAndUpdate(
					privateChat._id,
					{
						"lastMessage.text": updatedMessageText,
						"lastMessage.isTextEdited": true,
						"lastMessage.messageStatus": "Sent",
					}
				)
			}
		}

		if (_.isNull(updatedPrivateMessage)) return res.status(500).json({ error: "Unable to Update Private Message" })

		const friendId = extractPrivateChatFriendId(privateChat, user._id)

		NotificationHelper.updatePrivateMessage(friendId, updatedPrivateMessage)

		return res.status(200).json({ success: "Private Message Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Private Message" })
	}
}
