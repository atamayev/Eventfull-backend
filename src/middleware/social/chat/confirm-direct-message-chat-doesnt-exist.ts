import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import DirectMessageChatModel from "../../../models/direct-message-chat-model"

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
			if (!_.isEmpty(friend.username)) {
				return res.status(400).json({ message: `You already have a direct message chat with ${friend.username}` })
			}
			return res.status(400).json({ message: "You already have a direct message chat with this user" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Chat Already Exists" })
	}
}
