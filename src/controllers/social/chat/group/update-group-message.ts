import _ from "lodash"
import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group-message-model"
import GroupMessageChatModel from "../../../../models/chat/group-message-chat-model"

export default async function updateGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const chat = req.groupMessageChat
		const oldGroupMessage = req.groupMessage
		const newMessageText = req.body.newMessageText

		// TODO: If text is edited, consider making read by empty array. do same for direct message
		await GroupMessageModel.findByIdAndUpdate(
			oldGroupMessage._id,
			{ $set:
				{
					isTextEdited: true,
					text: newMessageText
				}
			}
		)

		if (_.isNull(chat.lastMessage)) return res.status(400).json( { message: "No last message in chat model" })

		if (_.isEqual(chat.lastMessage.messageId, oldGroupMessage._id)) {
			await GroupMessageChatModel.findByIdAndUpdate(
				chat._id,
				{
					"lastMessage.text": newMessageText,
					"lastMessage.isTextEdited": true
				}
			)
		}

		return res.status(200).json({ success: "Group Message Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Group Message" })
	}
}
