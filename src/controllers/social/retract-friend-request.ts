import { Request, Response } from "express"
import clearOutgoingFriendRequest from "../../utils/social/friend/clear-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import notificationHelper from "../../utils/notification-helper"

export default async function retractFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const outgoingFriendRequestExists = checkIfOutgoingFriendRequestExists(user, friend._id)
		if (outgoingFriendRequestExists === false) {
			return res.status(400).json({ message: "Outgoing Friend Request does not exist" })
		}

		await clearOutgoingFriendRequest(user._id, friend._id)
		await notificationHelper(user, friend._id, "retractFriendRequest", false)

		return res.status(200).json({ success: "Friend Request Retracted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retract Friend Request" })
	}
}
