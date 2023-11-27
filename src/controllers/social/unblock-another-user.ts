import _ from "lodash"
import { Request, Response } from "express"
import checkIfUserBlockedFriend from "../../utils/social/block/check-if-user-blocked-friend"
import unblockUser from "../../utils/social/block/unblock-user"
import checkIfFriendBlockedUser from "../../utils/social/block/check-if-friend-blocked-user"

export default async function unblockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const unblockedUserId = req.unblockedUserId
		const unblockedUserUsername = req.unblockedUserUsername

		if (userId === unblockedUserId) return res.status(400).json({ message: "You cannot unblock yourself" })

		const isOtherUserBlocked = await checkIfUserBlockedFriend(userId, unblockedUserId)

		if (isOtherUserBlocked === false) {
			if (!_.isEmpty(unblockedUserUsername)) {
				return res.status(400).json({ message: `${unblockedUserUsername} is not blocked` })
			}
			return res.status(400).json({ message: "User is already unblocked" })
		}

		const didOtherUserBlockYou = await checkIfFriendBlockedUser(userId, unblockedUserId)
		if (didOtherUserBlockYou === true) {
			if (!_.isEmpty(unblockedUserUsername)) {
				return res.status(400).json({ message: `${unblockedUserUsername} has blocked you` })
			}
			return res.status(400).json({ message: "User has blocked you" })
		}

		await unblockUser(userId, unblockedUserId)

		if (!_.isEmpty(unblockedUserUsername)) {
			return res.status(200).json({ message: `${unblockedUserUsername} unblocked` })
		}

		return res.status(200).json({ message: "User unblocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
