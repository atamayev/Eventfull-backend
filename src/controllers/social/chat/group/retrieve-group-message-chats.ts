import _ from "lodash"
import { Request, Response } from "express"
import GroupMessageChatModel from "../../../../models/chat/group-message-chat-model"

export default async function retrieveGroupMessageChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const userGroupMessageChats = user.groupMessageChats

		if (_.isEmpty(userGroupMessageChats)) {
			return res.status(200).json({ groupMessageChats: [] })
		}

		const groupMessageChats = await GroupMessageChatModel.find({
			participants: user._id,
			isActive: true
		}).exec()

		return res.status(200).json({ groupMessageChats })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveGroup Message Chats" })
	}
}
