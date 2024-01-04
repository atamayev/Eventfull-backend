import { Request, Response } from "express"
import DirectMessageChatModel from "../../../models/chat/direct-message-chat-model"
import UserModel from "../../../models/user-model"

export default async function createDirectMessageChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const directMessageChat = await DirectMessageChatModel.create({
			participants: [user._id, friend._id],
			lastMessage: null,
		})

		await UserModel.findByIdAndUpdate(user._id, {
			$push: {
				directMessageChats: directMessageChat._id,
			},
		})

		await UserModel.findByIdAndUpdate(friend._id, {
			$push: {
				directMessageChats: directMessageChat._id,
			},
		})

		return res.status(200).json({ success: "Direct Message Chat Created" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Chat" })
	}
}
