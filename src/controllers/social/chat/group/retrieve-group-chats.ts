import _ from "lodash"
import { Request, Response } from "express"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"

export default async function retrieveGroupChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const userGroupChats = user.groupChats

		if (_.isEmpty(userGroupChats)) {
			return res.status(200).json({ groupChats: [] })
		}

		const groupChats = await GroupChatModel.find({
			participants: user._id,
			isActive: true
		}).exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.groupChats.forEach(groupChat => {
			chatIdToNameMap[groupChat.groupChatId.toString()] = groupChat.chatName
		})

		const chatsWithNames = groupChats.map(chat => {
			return {
				...chat.toObject(),
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat"
			}
		})

		return res.status(200).json({ groupChats: chatsWithNames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveGroup Message Chats" })
	}
}
