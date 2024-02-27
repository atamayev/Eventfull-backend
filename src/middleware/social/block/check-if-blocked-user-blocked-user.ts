import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default function checkIfBlockedUserBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const blockedUser = req.blockedUser

		const hasOtherUserBlockedMe = checkIfUserBlockedByFriend(user, blockedUser._id)

		if (hasOtherUserBlockedMe === true) {
			if (_.isEmpty(blockedUser.username)) {
				return res.status(400).json({ message: "User has blocked you" })
			}
			return res.status(400).json({ message: `${blockedUser.username} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Blocked User Blocked User" })
	}
}
