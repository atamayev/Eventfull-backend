import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import findUser from "../../../../utils/find/find-user"

export default async function extractFriendsFromChat (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const user = req.user
		const chat = req.groupMessageChat
		const friendIds = chat.participants.filter(participant => !participant.equals(user._id))

		if (_.isEmpty(friendIds)) {
			return res.status(400).json({ message: "Friends not found" })
		}

		// Find all friends using the friendIds
		const friendPromises = friendIds.map(friendId => findUser(friendId))
		const friends = await Promise.all(friendPromises)

		// Check if any friend is not found (assuming findUser returns null if not found)
		if (friends.some(friend => _.isNull(friend))) {
			return res.status(400).json({ message: "One or more friends not found" })
		}

		req.friends = friends as User[]

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Find Friends from group chat" })
	}
}
