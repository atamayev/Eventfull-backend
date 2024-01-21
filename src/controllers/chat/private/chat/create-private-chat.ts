import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"
import PrivateChatModel from "../../../../models/chat/private/private-chat-model"

export default async function createPrivateChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const newPrivateChat = await PrivateChatModel.create({
			participantDetails: [{
				userId: user._id,
				username: user.username},
			{	userId: friend._id,
				username: friend.username
			}],
			lastMessage: null,
		})

		const userChatName = friend.username || `Chat with ${friend.firstName}`

		const userUpdate = UserModel.findByIdAndUpdate(user._id, {
			$push: {
				privateChats: {
					privateChatId: newPrivateChat._id,
					chatName: userChatName
				}
			},
		})

		const friendUpdate = UserModel.findByIdAndUpdate(friend._id, {
			$push: {
				privateChats: {
					privateChatId: newPrivateChat._id,
					chatName: user.username || `Chat with ${user.firstName}`
				}
			},
		})

		await Promise.all([userUpdate, friendUpdate])

		const privateChat = addChatNameToChat(newPrivateChat, userChatName)

		return res.status(200).json({ privateChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Chat" })
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addChatNameToChat(chat: any, chatName: string): PrivateChatWithNames {
	const chatData = chat._doc ? { ...chat._doc } : { ...chat }
	chatData.chatName = chatName
	return chatData
}
