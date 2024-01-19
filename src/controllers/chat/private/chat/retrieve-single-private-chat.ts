import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"

export default async function retrieveSinglePrivateChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const reqPrivateChat = req.privateChat

		const chatName = await UserModel.findOne(
			{ _id: user._id },
			{ privateChats: { $elemMatch: { privateChatId: reqPrivateChat._id } } }
		)

		if (_.isNull(chatName) || _.isEmpty(chatName.privateChats)) {
			return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Private Message Chats" })
		}
		const privateChat = attachChatNameToChat(reqPrivateChat, chatName.privateChats[0].chatName)

		return res.status(200).json({ privateChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Private Message Chats" })
	}
}

const attachChatNameToChat = (privateChat: PrivateChat, chatName: string): PrivateChatWithNames => ({
	...privateChat,
	chatName
})
