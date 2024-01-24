import _ from "lodash"
import { Request, Response } from "express"
import GroupMessageModel from "../../../../models/chat/group/group-message-model"

export default async function retrieveGroupChatMessages(req: Request, res: Response): Promise<Response> {
	try {
		const groupChat = req.groupChat
		const { lastMessageId, limit } = req.query as { lastMessageId?: string; limit?: string }

		interface QueryType {
			groupChatId: typeof groupChat._id;
			_id?: { $lt: string };
		}

		let query: QueryType = { groupChatId: groupChat._id }
		if (!_.isUndefined(lastMessageId)) {
			query = { ...query, _id: { $lt: lastMessageId } }
		}

		const limitNumber = parseInt(limit || "20", 10)

		const groupMessages = await GroupMessageModel.find(query)
			.sort({ createdAt: -1 })
			.limit(limitNumber + 1) // Fetch one extra message for checking
			.lean()
			.exec()

		const hasMore = groupMessages.length > limitNumber
		const messagesToSend = hasMore ? groupMessages.slice(0, -1) : groupMessages

		return res.status(200).json({ groupMessages: messagesToSend, hasMore })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Group Chat Messages" })
	}
}
