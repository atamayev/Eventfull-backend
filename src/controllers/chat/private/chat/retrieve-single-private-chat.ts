import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"

export default async function retrieveSinglePrivateChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const reqPrivateChat = req.privateChat

		const userDoc = await UserModel.findOne(
			{ _id: user._id },
			{ privateChats: { $elemMatch: { privateChatId: reqPrivateChat._id } } }
		)

		if (_.isNull(userDoc) || _.isEmpty(userDoc.privateChats)) {
			return res.status(400).json({ message: "Private Chat Not Found" })
		}
		const privateChatName = userDoc.privateChats[0].chatName
		const privateChat = attachChatNameToChat(reqPrivateChat, privateChatName)

		return res.status(200).json({ privateChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Single Private Chat" })
	}
}

const attachChatNameToChat = (privateChat: PrivateChat, chatName: string): PrivateChatWithNames => ({
	...privateChat,
	chatName
})
