import { Types } from "mongoose"
import { Request, Response } from "express"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"

interface ChatData {
    privateChatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	privateMessageId?: Types.ObjectId
}

export default async function sendPrivateMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const privateChat = req.privateChat
		const message = req.body.privateMessage as string

		const data: ChatData = {
			privateChatId: privateChat._id,
			senderId: user._id,
			text: message
		}
		const privateMessage = await PrivateMessageModel.create(data)

		delete data.privateChatId
		data.privateMessageId = privateMessage._id

		await PrivateChatModel.findByIdAndUpdate(
			privateChat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		return res.status(200).json({ privateMessageId: privateMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Private Message" })
	}
}
