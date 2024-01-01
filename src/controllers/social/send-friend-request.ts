import _ from "lodash"
import { Request, Response } from "express"
import createOutgoingFriendRequest from "../../utils/social/friend/create-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"
import NotificationHelper from "../../classes/notification-helper"

export default async function sendFriendRequest (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const outgoingFriendRequestExists = checkIfOutgoingFriendRequestExists(user, friend._id)
		if (outgoingFriendRequestExists === true) {
			if (!_.isEmpty(friend.username)) {
				return res.status(400).json({ message: `You have already sent ${friend.username} a Friend Request.` })
			} else {
				return res.status(400).json({ message: "You have already sent this user a Friend Request" })
			}
		}

		const incomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, friend._id)
		if (incomingFriendRequestExists === true) {
			if (!_.isEmpty(friend.username)) {
				return res.status(400).json({ message: `${friend.username} has already sent you a Friend Request` })
			} else {
				return res.status(400).json({ message: "User has already sent you a Friend Request" })
			}
		}

		await createOutgoingFriendRequest(user, friend)
		await NotificationHelper.sendFriendRequest(user, friend)

		return res.status(200).json({ success: "Friend Request Sent" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Frend Request" })
	}
}
