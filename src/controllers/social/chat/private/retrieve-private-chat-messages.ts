import { Request, Response } from "express"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"

export default async function retrievePrivateChatMessages(req: Request, res: Response): Promise<Response> {
	try {
		const privateChat = req.privateChat

		const privateMessages = await PrivateMessageModel.find({
			privateChatId: privateChat._id,
		}).lean().exec()

		return res.status(200).json({ privateMessages })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve private messages" })
	}
}
