import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default function checkIfFriendBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const hasOtherUserBlockedMe = checkIfUserBlockedByFriend(user, friendId)

		if (hasOtherUserBlockedMe === true) {
			if (_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: "User has blocked you" })
			}
			return res.status(400).json({ message: `${friendUsername} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
