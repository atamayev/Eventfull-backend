import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUsersAreFriends from "../../../utils/social/friend/check-if-users-are-friends"

export default async function validateConfirmUsersAreFriends (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		if (_.isEqual(userId, friendId)) {
			return res.status(400).json({ message: "You cannot invite yourself" })
		}
		const areUsersFriends = await checkIfUsersAreFriends(userId, friendId)

		if (areUsersFriends === false) {
			if (_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: "You are not friends with this user" })
			}
			return res.status(400).json({ message: `You are not friends with ${friendUsername}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
