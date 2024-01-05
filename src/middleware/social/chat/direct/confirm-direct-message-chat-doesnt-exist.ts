import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import DirectMessageChatModel from "../../../../models/chat/direct/direct-message-chat-model"

export default async function confirmDirectMessageChatDoesntExist (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user
		const friend = req.friend

		const chat = await DirectMessageChatModel.findOne({
			participants: {
				$all: [user._id, friend._id],
			},
		})

		if (!_.isNull(chat)) {
			const username = friend.username || "this user"
			return res.status(400).json({ message: `You already have a direct message chat with ${username}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Chat Already Exists" })
	}
}
