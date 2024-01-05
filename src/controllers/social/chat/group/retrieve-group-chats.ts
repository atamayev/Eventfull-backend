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

		return res.status(200).json({ groupChats })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to RetrieveGroup Message Chats" })
	}
}
