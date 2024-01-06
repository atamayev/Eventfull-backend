import _ from "lodash"
import { Request, Response } from "express"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"

export default async function retrievePrivateChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		if (_.isEmpty(user.privateChats)) {
			return res.status(200).json({ privateChats: [] })
		}

		const privateChatIds = user.privateChats.map(chat => chat.privateChatId)

		const privateChats = await PrivateChatModel.find({
			_id: { $in: privateChatIds },
			isActive: true
		}).exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.privateChats.forEach(chat => {
			chatIdToNameMap[chat.privateChatId.toString()] = chat.chatName
		})

		const chatsWithNames = privateChats.map(chat => {
			return {
				...chat.toObject(),
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat"
			}
		})

		return res.status(200).json({ privateChats: chatsWithNames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Private Message Chats" })
	}
}
