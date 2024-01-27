import _ from "lodash"
import { Request, Response } from "express"

export default function retrieveSingleGroupChat(req: Request, res: Response): Response {
	try {
		const user = req.user
		const reqGroupChat = req.groupChat

		const userGroupChat = user.groupChats.find(chat => chat.groupChatId.toString() === reqGroupChat._id.toString())

		if (_.isUndefined(userGroupChat)) {
			return res.status(400).json({ message: "Group Chat Not Found" })
		}

		const groupChatName = userGroupChat.chatName
		const groupChat = attachChatNameToChat(reqGroupChat, groupChatName)

		return res.status(200).json({ groupChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Single Group Chat" })
	}
}

const attachChatNameToChat = (groupChat: GroupChat, chatName: string): GroupChatWithName => ({
	...groupChat,
	chatName
})
