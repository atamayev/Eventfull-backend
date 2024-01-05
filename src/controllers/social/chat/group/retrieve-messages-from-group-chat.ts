import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"

export default async function retrieveMessagesFromGroupChat(req: Request, res: Response): Promise<Response> {
	try {
		const groupChat = req.groupChat

		// Notes: Probably best to limit the amount of messages that can be retrieved at once
		// Also need to implement pagination, and query the results in reverse?
		// Same for direct messages
		const groupMessages = await GroupMessageModel.find({
			groupChatId: groupChat._id,
		}).exec()

		return res.status(200).json({ groupMessages })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveGroup Message Chats" })
	}
}
