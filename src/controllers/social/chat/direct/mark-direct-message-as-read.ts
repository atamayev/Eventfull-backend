import _ from "lodash"
import { Request, Response } from "express"
import DirectMessageModel from "../../../../models/chat/direct/direct-message-model"
import DirectMessageChatModel from "../../../../models/chat/direct/direct-message-chat-model"

export default async function markDirectMessageAsRead(req: Request, res: Response): Promise<Response> {
	try {
		const directMessageChat = req.directMessageChat
		const directMessage = req.directMessage

		await DirectMessageModel.findByIdAndUpdate(
			directMessage._id,
			{ readByOtherUser: true }
		)

		if (_.isNull(directMessageChat.lastMessage)) {
			return res.status(400).json ({ message: "No Last Message in the Direct Message Model"})
		}

		if (directMessage._id.toString() === directMessageChat.lastMessage.directMessageId.toString()) {
			await DirectMessageChatModel.findByIdAndUpdate(
				directMessageChat._id,
				{ "lastMessage.readByOtherUser": true })
		}

		return res.status(200).json({ success: "Message Marked as Read" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Mark Message as Read" })
	}
}
