import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import areUsersAreFriends from "../../../utils/social/friend/are-users-are-friends"

export default async function checkIfUsersAreFriends (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const alreadyFriends = await areUsersAreFriends(userId, friendId)

		if (alreadyFriends === true) {
			if (_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: "You are already friends with this user" })
			}
			return res.status(400).json({ message: `You are already friends with ${friendUsername}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
