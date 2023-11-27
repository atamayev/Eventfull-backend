import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUsersAreFriends from "../../utils/social/friend/check-if-users-are-friends"

export default async function validateCheckIfUsersAreFriends (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const alreadyFriends = await checkIfUsersAreFriends(userId, friendId)

		if (alreadyFriends === true) {
			if (_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: "User is already your friend" })
			}
			return res.status(400).json({ message: `${friendUsername} is already your friend` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
