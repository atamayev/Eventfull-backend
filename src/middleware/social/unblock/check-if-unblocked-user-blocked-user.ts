import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default function checkIfUnblockedUserBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const unblockedUser = req.unblockedUser

		const hasOtherUserBlockedMe = checkIfUserBlockedByFriend(user, unblockedUser._id)

		if (hasOtherUserBlockedMe === true) {
			if (_.isEmpty(unblockedUser.username)) {
				return res.status(400).json({ message: "User has blocked you" })
			}
			return res.status(400).json({ message: `${unblockedUser.username} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
