import _ from "lodash"
import { Request, Response } from "express"
import checkIfUserHasBlockedFriend from "../../utils/social/block/check-if-user-has-blocked-friend"
import unblockUser from "../../utils/social/block/unblock-user"

export default async function unblockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const unblockedUser = req.unblockedUser

		if (_.isEqual(user._id, unblockedUser._id)) return res.status(400).json({ message: "You cannot Unblock yourself" })

		const isOtherUserBlocked = checkIfUserHasBlockedFriend(user, unblockedUser._id)

		if (isOtherUserBlocked === false) {
			if (!_.isEmpty(unblockedUser.username)) {
				return res.status(400).json({ message: `${unblockedUser.username} is not Blocked` })
			}
			return res.status(400).json({ message: "User is already Unblocked" })
		}

		await unblockUser(user._id, unblockedUser._id)

		if (!_.isEmpty(unblockedUser.username)) {
			return res.status(200).json({ success: `${unblockedUser.username} Unblocked` })
		}

		return res.status(200).json({ success: "User Unblocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Unblock Other user" })
	}
}
