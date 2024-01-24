import _ from "lodash"
import { Request, Response } from "express"
import PrivateMessageModel from "../../../../models/chat/private/private-message-model"

export default async function retrievePrivateChatMessages(req: Request, res: Response): Promise<Response> {
	try {
		const privateChat = req.privateChat
		const { lastMessageId, limit } = req.query as { lastMessageId?: string; limit?: string }

		interface QueryType {
			privateChatId: typeof privateChat._id;
			_id?: { $lt: string };
		}

		let query: QueryType = { privateChatId: privateChat._id }
		if (!_.isUndefined(lastMessageId)) {
			query = { ...query, _id: { $lt: lastMessageId } }
		}

		const limitNumber = parseInt(limit || "20", 10)

		const privateMessages = await PrivateMessageModel.find(query)
			.sort({ createdAt: -1 })
			.limit(limitNumber + 1) // Fetch one extra message for checking
			.lean()
			.exec()

		const hasMore = privateMessages.length > limitNumber
		const messagesToSend = hasMore ? privateMessages.slice(0, -1) : privateMessages

		return res.status(200).json({ privateMessages: messagesToSend, hasMore })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve private messages" })
	}
}
