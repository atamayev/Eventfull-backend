import { Request, Response } from "express"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function declineFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const incomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, friend._id)
		if (incomingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend Request does not exist" })
		}

		await clearIncomingFriendRequest(user._id, friend._id)
		return res.status(200).json({ success: "Friend Request Declined" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Decline Friend Request" })
	}
}
