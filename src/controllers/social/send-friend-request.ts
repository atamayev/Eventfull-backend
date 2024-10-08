import { Request, Response } from "express"
import NotificationHelper from "../../classes/notification-helper"
import createOutgoingFriendRequest from "../../utils/social/friend/create-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function sendFriendRequest (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const outgoingFriendRequestExists = checkIfOutgoingFriendRequestExists(user, friend._id)
		if (outgoingFriendRequestExists === true) {
			const username = friend.username || "this user"
			return res.status(400).json({ message: `You have already sent ${username} a Friend Request` })
		}

		const incomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, friend._id)
		if (incomingFriendRequestExists === true) {
			const username = friend.username || "User"
			return res.status(400).json({ message: `${username} has already sent you a Friend Request` })
		}

		const createdAt = await createOutgoingFriendRequest(user, friend)
		await NotificationHelper.sendFriendRequest(user, friend, createdAt)

		return res.status(200).json({ createdAt })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Frend Request" })
	}
}
