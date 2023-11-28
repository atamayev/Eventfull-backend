import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedFriend from "../../../utils/social/block/check-if-user-blocked-friend"

export default async function validateCheckIfUserBlockedBlockedUser (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId
		const blockedUserId = req.blockedUserId
		const blockedUserUsername = req.blockedUserUsername

		const isOtherUserBlocked = await checkIfUserBlockedFriend(userId, blockedUserId)

		if (isOtherUserBlocked === true) {
			if (_.isEmpty(blockedUserUsername)) {
				return res.status(400).json({ message: "You have already blocked the other user" })
			}
			return res.status(400).json({ message: `${blockedUserUsername} is already blocked` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
