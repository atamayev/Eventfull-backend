import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedFriend from "../../utils/social/block/check-if-user-blocked-friend"

export default async function validateCheckIfUserBlockedFriend (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const isFriendBlocked = await checkIfUserBlockedFriend(userId, friendId)

		if (isFriendBlocked === true) {
			if (_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: "You have blocked the other user" })
			}
			return res.status(400).json({ message: `${friendUsername} is blocked` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
