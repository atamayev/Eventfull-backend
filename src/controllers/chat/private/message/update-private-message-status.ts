import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"
import { extractPrivateChatFriendId } from "../../../../utils/social/chat/extract-friend-ids"

export default async function updatePrivateMessageStatus(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const privateChat = req.privateChat
		const privateMessage = req.privateMessage
		const newMessageStatus = req.body.newMessageStatus as "Delivered" | "Read"

		await PrivateMessageModel.findByIdAndUpdate(
			privateMessage._id,
			{ messageStatus: newMessageStatus }
		)

		if (_.isNull(privateChat.lastMessage)) {
			return res.status(400).json ({ message: "No Last Message in the Private Message Model"})
		}

		if (privateMessage._id.toString() === privateChat.lastMessage.privateMessageId.toString()) {
			await PrivateChatModel.findByIdAndUpdate(
				privateChat._id,
				{ "lastMessage.messageStatus": newMessageStatus })
		}

		const friendId = extractPrivateChatFriendId(privateChat, user._id)

		NotificationHelper.updatePrivateMessageStatus(friendId, privateMessage, newMessageStatus)

		return res.status(200).json({ success: `Message Marked ${newMessageStatus}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Mark Update message status" })
	}
}
