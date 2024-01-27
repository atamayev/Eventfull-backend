import { Request, Response } from "express"
import acceptFriendRequest from "../../utils/social/friend/accept-friend-request"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"

export default async function respondToFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend
		const response = req.body.response as AcceptOrDecline

		const incomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, friend._id)
		if (incomingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend Request does not exist" })
		}

		let createdAt

		if (response === "Accept") {
			createdAt = await acceptFriendRequest(user, friend)
		}

		await clearIncomingFriendRequest(user._id, friend._id)

		if (response === "Accept") {
			return res.status(200).json({ createdAt })
		} else {
			return res.status(200).json({ success: "Friend Request Declined" })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Respond to Friend Request" })
	}
}
