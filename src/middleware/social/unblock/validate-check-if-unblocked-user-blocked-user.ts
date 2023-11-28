import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfFriendBlockedUser from "../../../utils/social/block/check-if-friend-blocked-user"

export default async function validateCheckIfUnblockedUserBlockedUser (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId
		const unblockedUserId = req.unblockedUserId
		const unblockedUserUsername = req.unblockedUserUsername

		const hasOtherUserBlockedMe = await checkIfFriendBlockedUser(userId, unblockedUserId)

		if (hasOtherUserBlockedMe === true) {
			if (_.isEmpty(unblockedUserUsername)) {
				return res.status(400).json({ message: "User has blocked you" })
			}
			return res.status(400).json({ message: `${unblockedUserUsername} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
