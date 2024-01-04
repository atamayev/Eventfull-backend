import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function editDirectMessageChatName(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const directMessageChat = req.directMessageChat
		const newDirectMessageChatName = req.body.newDirectMessageChatName

		await UserModel.findByIdAndUpdate(
			user._id,
			{
				$set: {
					"directMessageChats.$[elem].chatName": newDirectMessageChatName
				}
			},
			{
				arrayFilters: [{"elem.directMessageChatId": directMessageChat._id}],
				new: true
			}
		)

		return res.status(200).json({ success: "Direct Message Chat name updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Edit Chat Name" })
	}
}
