import _ from "lodash"
import { Request, Response } from "express"
import checkIfUserBlocked from "../../utils/social/check-if-user-blocked"
import UserModel from "../../models/user-model"
import unblockUser from "../../utils/social/unblock-user"
import checkIfFriendBlockedUser from "../../utils/social/check-if-friend-blocked-user"

// eslint-disable-next-line complexity
export default async function unblockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const unblockedUserId = req.unblockedUserId

		if (userId === unblockedUserId) return res.status(400).json({ message: "You cannot unblock yourself" })

		const unblockedUserUsername = await UserModel.findById(unblockedUserId).select("username")

		const isOtherUserBlocked = await checkIfUserBlocked(userId, unblockedUserId)

		if (isOtherUserBlocked === false) {
			if (!_.isNull(unblockedUserUsername) && !_.isUndefined(unblockedUserUsername.username)) {
				return res.status(400).json({ message: `${unblockedUserUsername.username} is not blocked` })
			}
			return res.status(400).json({ message: "User is already unblocked" })
		}

		const didOtherUserBlockYou = await checkIfFriendBlockedUser(userId, unblockedUserId)
		if (didOtherUserBlockYou === true) {
			if (!_.isNull(unblockedUserUsername) && !_.isUndefined(unblockedUserUsername.username)) {
				return res.status(400).json({ message: `${unblockedUserUsername.username} has blocked you` })
			}
			return res.status(400).json({ message: "User has blocked you" })
		}

		await unblockUser(userId, unblockedUserId)


		if (!_.isNull(unblockedUserUsername) && !_.isUndefined(unblockedUserUsername.username)) {
			return res.status(200).json({ message: `${unblockedUserUsername.username} unblocked` })
		}

		return res.status(200).json({ message: "User unblocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
