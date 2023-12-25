import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import areUsersFriends from "../../../utils/social/friend/are-users-friends"

export default function confirmUsersAreFriends (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		if (_.isEqual(user._id, friend._id)) {
			return res.status(400).json({ message: "You cannot invite yourself" })
		}
		const areBothUsersFriends = areUsersFriends(user, friend._id)

		if (areBothUsersFriends === false) {
			if (_.isEmpty(friend.username)) {
				return res.status(400).json({ message: "You are not friends with this user" })
			}
			return res.status(400).json({ message: `You are not friends with ${friend.username}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm Users are Friends" })
	}
}
