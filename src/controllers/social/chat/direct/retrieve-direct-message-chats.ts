import _ from "lodash"
import { Request, Response } from "express"
import DirectMessageChatModel from "../../../../models/chat/direct/direct-message-chat-model"

export default async function retrieveDirectMessageChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const userDirectMessageChats = user.directMessageChats

		// TODO: Also return the user's chat name. will have to first go through the user schema and add a chat name field.
		// do the same for group chats
		if (_.isEmpty(userDirectMessageChats)) {
			return res.status(200).json({ directMessageChats: [] })
		}

		const directMessageChats = await DirectMessageChatModel.find({
			participants: user._id,
			isActive: true
		}).exec()

		return res.status(200).json({ directMessageChats })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveDirect Message Chats" })
	}
}
