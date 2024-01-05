import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"
import DirectMessageChatModel from "../../../../models/chat/direct/direct-message-chat-model"

export default async function createDirectMessageChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const directMessageChat = await DirectMessageChatModel.create({
			participants: [user._id, friend._id],
			lastMessage: null,
		})

		const userUpdate = UserModel.findByIdAndUpdate(user._id, {
			$push: {
				directMessageChats: {
					directMessageChatId: directMessageChat._id,
					chatName: friend.username || `Chat with ${friend.firstName}`
				}
			},
		})

		const friendUpdate = UserModel.findByIdAndUpdate(friend._id, {
			$push: {
				directMessageChats: {
					directMessageChatId: directMessageChat._id,
					chatName: user.username || `Chat with ${user.firstName}`
				}
			},
		})

		await Promise.all([userUpdate, friendUpdate])

		return res.status(200).json({ directMessageChatId: directMessageChat._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Chat" })
	}
}
