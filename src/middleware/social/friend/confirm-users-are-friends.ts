import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import areUsersAreFriends from "../../../utils/social/friend/are-users-are-friends"

export default function confirmUsersAreFriends (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		if (_.isEqual(user._id, friend._id)) {
			return res.status(400).json({ message: "You cannot invite yourself" })
		}
		const areUsersFriends = areUsersAreFriends(user, friend._id)

		if (areUsersFriends === false) {
			if (_.isEmpty(friend.username)) {
				return res.status(400).json({ message: "You are not friends with this user" })
			}
			return res.status(400).json({ message: `You are not friends with ${friend.username}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
