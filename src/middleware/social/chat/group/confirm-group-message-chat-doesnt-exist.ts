import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"

export default async function confirmGroupChatDoesntExist(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user
		const friends = req.friends

		const participantIds = [user._id, ...friends.map(friend => friend._id)]

		const groupChat = await GroupChatModel.findOne({
			$and: [
				{ participants: { $all: participantIds } },
				{ participants: { $size: participantIds.length } }
			]
		})

		if (!_.isNull(groupChat)) {
			return res.status(400).json({ message: "A group chat with these participants already exists" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Chat Already Exists" })
	}
}
