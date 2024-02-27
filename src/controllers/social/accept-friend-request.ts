import { Request, Response } from "express"
import acceptFriendRequestHelper from "../../utils/social/friend/accept-friend-request-helper"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function acceptFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend
		const createdAt = req.body.createdAt

		const incomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, friend._id)
		if (incomingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend Request does not exist" })
		}

		await acceptFriendRequestHelper(user, friend, createdAt)

		await clearIncomingFriendRequest(user._id, friend._id)

		return res.status(200).json({ success: "Friend Request Accepted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Accept Friend Request" })
	}
}
