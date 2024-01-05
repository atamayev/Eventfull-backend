import { Request, Response } from "express"
import DirectMessageModel from "../../../../models/chat/direct-message-model"

export default async function retrieveDirectMessagesFromChat(req: Request, res: Response): Promise<Response> {
	try {
		const directMessageChat = req.directMessageChat

		const directMessages = await DirectMessageModel.find({
			chatId: directMessageChat._id,
		}).exec()

		return res.status(200).json({ directMessages })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveDirect Message Chats" })
	}
}