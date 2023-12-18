import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserHasBlockedFriend from "../../../utils/social/block/check-if-user-has-blocked-friend"

export default function checkIfUserBlockedFriend (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const isOtherUserBlocked = checkIfUserHasBlockedFriend(user, friendId)

		if (isOtherUserBlocked === true) {
			if (_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: "You have already blocked the other user" })
			}
			return res.status(400).json({ message: `${friendUsername} is already blocked` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
