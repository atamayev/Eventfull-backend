import _ from "lodash"
import { Request, Response } from "express"
import GroupMessageChatModel from "../../../../models/chat/group-message-chat-model"
import GroupMessageModel from "../../../../models/chat/group-message-model"

export default async function markGroupMessageAsRead(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const chat = req.groupMessageChat
		const groupMessage = req.groupMessage

		await GroupMessageModel.findByIdAndUpdate(
			groupMessage._id,
			{ $addToSet: { readBy: user._id } }
		)

		if (_.isNull(chat.lastMessage)) {
			return res.status(400).json ({ message: "No Last Message in the Group Message Model"})
		}
		if (groupMessage._id.toString() === chat.lastMessage.messageId.toString()) {
			await GroupMessageChatModel.findByIdAndUpdate(
				chat._id,
				{ $addToSet: { "lastMessage.readBy": user._id } }
			)
		}

		return res.status(200).json({ success: "Message Marked as Read" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Mark Message as Read" })
	}
}
