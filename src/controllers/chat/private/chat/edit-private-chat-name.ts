import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"

export default async function editPrivateChatName(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const privateChat = req.privateChat
		const updatedPrivateChatName = req.body.updatedPrivateChatName

		await UserModel.findByIdAndUpdate(
			user._id,
			{
				$set: {
					"privateChats.$[elem].chatName": updatedPrivateChatName
				}
			},
			{
				arrayFilters: [{"elem.privateChatId": privateChat._id}],
				new: true
			}
		)

		return res.status(200).json({ success: `Private Chat name updated to: ${updatedPrivateChatName}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Edit Chat Name" })
	}
}
