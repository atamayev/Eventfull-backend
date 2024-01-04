import _ from "lodash"
import { Request, Response } from "express"
import DirectMessageModel from "../../../models/chat/direct-message-model"
import DirectMessageChatModel from "../../../models/chat/direct-message-chat-model"

export default async function updateDirectMessage(req: Request, res: Response): Promise<Response> {
	try {
		const chat = req.directMessageChat
		const oldDirectMessage = req.directMessage
		const newMessageText = req.body.newMessageText

		await DirectMessageModel.findByIdAndUpdate(
			oldDirectMessage._id,
			{ $set:
				{
					isTextEdited: true,
					text: newMessageText
				}
			}
		)

		if (_.isNull(chat.lastMessage)) return res.status(400).json( { message: "No last message in chat model" })

		if (_.isEqual(chat.lastMessage.messageId, oldDirectMessage._id)) {
			await DirectMessageChatModel.findByIdAndUpdate(
				chat._id,
				{
					"lastMessage.text": newMessageText,
					"lastMessage.isTextEdited": true
				}
			)
		}

		return res.status(200).json({ success: "Direct Message Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Direct Message" })
	}
}
