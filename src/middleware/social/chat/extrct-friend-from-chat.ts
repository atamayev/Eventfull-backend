import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import findUser from "../../../utils/find/find-user"

export default async function extractFriendFromChat (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const user = req.user
		const chat = req.directMessageChat
		const friendId = chat.participants.find((participant) => !participant.equals(user._id))

		if (_.isUndefined(friendId)) return res.status(400).json({ message: "Friend not found" })
		const friend = await findUser(friendId)

		if (_.isNull(friend)) return res.status(400).json({ message: "Friend not found" })

		req.friend = friend

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Find Friend from chat" })
	}
}
