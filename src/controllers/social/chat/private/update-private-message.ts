import _ from "lodash"
import { Request, Response } from "express"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"

export default async function updatePrivateMessage(req: Request, res: Response): Promise<Response> {
	try {
		const privateChat = req.privateChat
		const oldPrivateMessage = req.privateMessage
		const updatedMessageText = req.body.updatedMessageText

		await PrivateMessageModel.findByIdAndUpdate(
			oldPrivateMessage._id,
			{ $set:
				{
					isTextEdited: true,
					text: updatedMessageText,
					readByOtherUser: false
				}
			}
		)

		if (_.isNull(privateChat.lastMessage)) return res.status(400).json( { message: "No last message in chat model" })

		if (_.isEqual(privateChat.lastMessage.privateMessageId, oldPrivateMessage._id)) {
			await PrivateChatModel.findByIdAndUpdate(
				privateChat._id,
				{
					"lastMessage.text": updatedMessageText,
					"lastMessage.isTextEdited": true,
					"lastMessage.readByOtherUser": false,
				}
			)
		}

		return res.status(200).json({ success: "Private Message Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Private Message" })
	}
}
