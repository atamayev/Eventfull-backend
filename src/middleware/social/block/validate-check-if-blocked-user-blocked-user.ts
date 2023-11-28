import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfFriendBlockedUser from "../../../utils/social/block/check-if-friend-blocked-user"

export default async function validateCheckIfBlockedUserBlockedUser (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId
		const blockedUserId = req.blockedUserId
		const blockedUserUsername = req.blockedUserUsername

		const hasOtherUserBlockedMe = await checkIfFriendBlockedUser(userId, blockedUserId)

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
