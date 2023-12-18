import _ from "lodash"
import { Request, Response } from "express"
import checkIfUserHasBlockedFriend from "../../utils/social/block/check-if-user-has-blocked-friend"
import unblockUser from "../../utils/social/block/unblock-user"

export default async function unblockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const unblockedUserId = req.unblockedUserId
		const unblockedUserUsername = req.unblockedUserUsername

		if (_.isEqual(user._id, unblockedUserId)) return res.status(400).json({ message: "You cannot unblock yourself" })

		const isOtherUserBlocked = checkIfUserHasBlockedFriend(user, unblockedUserId)

		if (isOtherUserBlocked === false) {
			if (!_.isEmpty(unblockedUserUsername)) {
				return res.status(400).json({ message: `${unblockedUserUsername} is not blocked` })
			}
			return res.status(400).json({ message: "User is already unblocked" })
		}

		await unblockUser(user._id, unblockedUserId)

		if (!_.isEmpty(unblockedUserUsername)) {
			return res.status(200).json({ message: `${unblockedUserUsername} unblocked` })
		}

		return res.status(200).json({ message: "User unblocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
