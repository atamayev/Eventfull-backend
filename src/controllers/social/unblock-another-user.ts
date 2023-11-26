import _ from "lodash"
import { Request, Response } from "express"
import checkIfUserDoubleBlocking from "../../utils/social/check-if-user-double-blocking"
import UserModel from "../../models/user-model"
import unblockUser from "../../utils/social/unblock-user"

export default async function unblockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const unblockedUserId = req.unblockedUserId

		if (userId === unblockedUserId) return res.status(400).json({ message: "You cannot unblock yourself" })

		const isOtherUserBlocked = await checkIfUserDoubleBlocking(userId, unblockedUserId)

		if (isOtherUserBlocked === false) return res.status(400).json({ message: "User is already unblocked" })

		await unblockUser(userId, unblockedUserId)

		const unblockedUserUsername = await UserModel.findById(unblockedUserId).select("username")

		if (!_.isNull(unblockedUserUsername) && !_.isUndefined(unblockedUserUsername.username)) {
			return res.status(200).json({ message: `${unblockedUserUsername.username} unblocked` })
		}

		return res.status(200).json({ message: "User unblocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
