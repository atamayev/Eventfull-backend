import _ from "lodash"
import { Request, Response } from "express"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"

export default async function retrieveGroupChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		if (_.isEmpty(user.groupChats)) {
			return res.status(200).json({ groupChats: [] })
		}

		const groupChatIds = user.groupChats.map(chat => chat.groupChatId)

		const groupChats = await GroupChatModel.find({
			_id: { $in: groupChatIds },
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
