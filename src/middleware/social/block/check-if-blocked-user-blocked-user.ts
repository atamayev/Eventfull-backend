import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default  function checkIfBlockedUserBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const blockedUserId = req.blockedUserId
		const blockedUserUsername = req.blockedUserUsername

		const hasOtherUserBlockedMe = checkIfUserBlockedByFriend(user, blockedUserId)

		if (hasOtherUserBlockedMe === true) {
			if (_.isEmpty(blockedUserUsername)) {
				return res.status(400).json({ message: "User has blocked you" })
			}
			return res.status(400).json({ message: `${blockedUserUsername} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
