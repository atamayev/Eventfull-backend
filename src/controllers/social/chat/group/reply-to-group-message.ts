import { Types } from "mongoose"
import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"
import GroupMessageChatModel from "../../../../models/chat/group/group-chat-model"

interface ReplyToGroupChatData {
    groupChatId?: Types.ObjectId
    senderId: Types.ObjectId
    text: string
	groupMessageId?: Types.ObjectId
	replyTo: Types.ObjectId
}

export default async function replyToGroupMessage(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const groupMessageReplyingTo = req.groupMessage
		const groupMessageChat = req.groupChat
		const message = req.body.groupMessage as string

		const data: ReplyToGroupChatData = {
			groupChatId: groupMessageChat._id,
			senderId: user._id,
			text: message,
			replyTo: groupMessageReplyingTo._id
		}
		const groupMessage = await GroupMessageModel.create(data)

		delete data.groupChatId

		data.groupMessageId = groupMessage._id
		await GroupMessageChatModel.findByIdAndUpdate(
			groupMessageChat._id,
			{ $set:
				{ lastMessage: data }
			}
		)

		return res.status(200).json({ groupMessageId: groupMessage._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Reply to Group Message" })
	}
}
