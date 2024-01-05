import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import GroupMessageChatModel from "../../../../models/chat/group-message-chat-model"

export default async function confirmGroupMessageChatDoesntExist(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user
		const friends = req.friends

		const participantIds = [user._id, ...friends.map(friend => friend._id)]

		const chat = await GroupMessageChatModel.findOne({
			$and: [
				{ participants: { $all: participantIds } },
				{ participants: { $size: participantIds.length } }
			]
		})

		if (!_.isNull(chat)) {
			return res.status(400).json({ message: "A group chat with these participants already exists" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Chat Already Exists" })
	}
}
