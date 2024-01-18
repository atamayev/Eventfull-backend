import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"
import PrivateChatModel from "../../../../models/chat/private/private-chat-model"

export default async function createPrivateChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const privateChat = await PrivateChatModel.create({
			participantDetails: [{
				_id: user._id,
				username: user.username},
			{	_id: friend._id,
				username: friend.username
			}],
			lastMessage: null,
		})

		const userUpdate = UserModel.findByIdAndUpdate(user._id, {
			$push: {
				privateChats: {
					privateChatId: privateChat._id,
					chatName: friend.username || `Chat with ${friend.firstName}`
				}
			},
		})

		const friendUpdate = UserModel.findByIdAndUpdate(friend._id, {
			$push: {
				privateChats: {
					privateChatId: privateChat._id,
					chatName: user.username || `Chat with ${user.firstName}`
				}
			},
		})

		await Promise.all([userUpdate, friendUpdate])

		return res.status(200).json({ privateChatId: privateChat._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Chat" })
	}
}
