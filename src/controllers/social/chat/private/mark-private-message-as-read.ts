import _ from "lodash"
import { Request, Response } from "express"
import NotificationHelper from "../../../../classes/notification-helper"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"

export default async function markPrivateMessageAsRead(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const privateChat = req.privateChat
		const privateMessage = req.privateMessage

		await PrivateMessageModel.findByIdAndUpdate(
			privateMessage._id,
			{ readByOtherUser: true }
		)

		if (_.isNull(privateChat.lastMessage)) {
			return res.status(400).json ({ message: "No Last Message in the Private Message Model"})
		}

		if (privateMessage._id.toString() === privateChat.lastMessage.privateMessageId.toString()) {
			await PrivateChatModel.findByIdAndUpdate(
				privateChat._id,
				{ "lastMessage.readByOtherUser": true })
		}

		NotificationHelper.markPrivateMessageAsRead(
			privateChat.participants.find(participantId => participantId !== user._id),
			privateChat._id,
			privateMessage._id
		)

		return res.status(200).json({ success: "Message Marked as Read" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Mark Message as Read" })
	}
}