import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import PrivateChatModel from "../../../../models/chat/private/private-message-chat-model"

export default async function confirmPrivateChatDoesntExist (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user
		const friend = req.friend

		const privateChat = await PrivateChatModel.findOne({
			participants: {
				$all: [user._id, friend._id],
			},
		})

		if (!_.isNull(privateChat)) {
			const username = friend.username || "this user"
			return res.status(400).json({ message: `You already have a private chat with ${username}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Chat Already Exists" })
	}
}
