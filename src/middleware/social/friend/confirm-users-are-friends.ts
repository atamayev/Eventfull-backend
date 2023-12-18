import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import areUsersAreFriends from "../../../utils/social/friend/are-users-are-friends"

export default async function confirmUsersAreFriends (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const user = req.user
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		if (_.isEqual(user._id, friendId)) {
			return res.status(400).json({ message: "You cannot invite yourself" })
		}
		const areUsersFriends = await areUsersAreFriends(user._id, friendId)

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
