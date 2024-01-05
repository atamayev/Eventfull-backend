import _ from "lodash"
import { Request, Response } from "express"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"

export default async function updateGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const groupChat = req.groupChat
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

		if (_.isNull(groupChat.lastMessage)) return res.status(400).json( { message: "No last message in chat model" })

		if (_.isEqual(groupChat.lastMessage.groupMessageId, oldGroupMessage._id)) {
			await GroupChatModel.findByIdAndUpdate(
				groupChat._id,
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
