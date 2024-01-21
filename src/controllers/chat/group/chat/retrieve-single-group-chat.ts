import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"

export default async function retrieveSingleGroupChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const reqGroupChat = req.groupChat

		const chatName = await UserModel.findOne(
			{ _id: user._id },
			{ groupChats: { $elemMatch: { groupChatId: reqGroupChat._id } } }
		)

		if (_.isNull(chatName) || _.isEmpty(chatName.groupChats)) {
			return res.status(400).json({ message: "Group Chat Not Found" })
		}
		const groupChat = attachChatNameToChat(reqGroupChat, chatName.groupChats[0].chatName)

		return res.status(200).json({ groupChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Group Message Chats" })
	}
}

const attachChatNameToChat = (groupChat: GroupChat, chatName: string): GroupChatWithNames => ({
	...groupChat,
	chatName
})
