import _ from "lodash"
import { Request, Response } from "express"
import DirectMessageChatModel from "../../../../models/chat/direct/direct-message-chat-model"

export default async function retrieveDirectMessageChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const userDirectMessageChats = user.directMessageChats

		if (_.isEmpty(userDirectMessageChats)) {
			return res.status(200).json({ directMessageChats: [] })
		}

		const directMessageChats = await DirectMessageChatModel.find({
			participants: user._id,
			isActive: true
		}).exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.directMessageChats.forEach(chat => {
			chatIdToNameMap[chat.directMessageChatId.toString()] = chat.chatName
		})

		const chatsWithNames = directMessageChats.map(chat => {
			return {
				...chat.toObject(),
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat"
			}
		})

		return res.status(200).json({ directMessageChats: chatsWithNames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveDirect Message Chats" })
	}
}
