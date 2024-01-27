import _ from "lodash"
import { Request, Response } from "express"

export default function retrieveSinglePrivateChat(req: Request, res: Response): Response {
	try {
		const user = req.user
		const reqPrivateChat = req.privateChat

		const userPrivateChat = user.privateChats.find(chat => chat.privateChatId.toString() === reqPrivateChat._id.toString())

		if (_.isUndefined(userPrivateChat)) {
			return res.status(400).json({ message: "Private Chat Not Found" })
		}

		const privateChatName = userPrivateChat.chatName
		const privateChat = attachChatNameToChat(reqPrivateChat, privateChatName)

		return res.status(200).json({ privateChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Single Private Chat" })
	}
}

const attachChatNameToChat = (privateChat: PrivateChat, chatName: string): PrivateChatWithName => ({
	...privateChat,
	chatName
})
