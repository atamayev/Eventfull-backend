import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"

export default async function editGroupChatName(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupChat = req.groupChat
		const newGroupChatName = req.body.newGroupChatName

		await UserModel.findByIdAndUpdate(
			user._id,
			{
				$set: {
					"groupChats.$[elem].chatName": newGroupChatName
				}
			},
			{
				arrayFilters: [{"elem.groupChatId": groupChat._id}],
				new: true
			}
		)

		return res.status(200).json({ success: `Group Chat name updated to: ${newGroupChatName}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Edit Chat Name" })
	}
}
