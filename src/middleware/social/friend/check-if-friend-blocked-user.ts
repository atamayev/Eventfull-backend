import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default function checkIfFriendBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		const hasOtherUserBlockedMe = checkIfUserBlockedByFriend(user, friend._id)

		if (hasOtherUserBlockedMe === true) {
			if (_.isEmpty(friend.username)) {
				return res.status(400).json({ message: "User has blocked you" })
			}
			return res.status(400).json({ message: `${friend.username} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Check if Friend Blocked User" })
	}
}
