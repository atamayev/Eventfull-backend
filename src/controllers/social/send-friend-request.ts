import _ from "lodash"
import { Request, Response } from "express"
import createOutgoingFriendRequest from "../../utils/social/friend/create-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function sendFriendRequest (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const outgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, friendId)
		if (outgoingFriendRequestExists === true) {
			if (!_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: `You have already sent a friend request to ${friendUsername}` })
			} else {
				return res.status(400).json({ message: "You have already sent a friend request to this user" })
			}
		}

		const incomingFriendRequestExists = await checkIfIncomingFriendRequestExists(userId, friendId)
		if (incomingFriendRequestExists === true) {
			if (!_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: `${friendUsername} has already sent you a friend request` })
			} else {
				return res.status(400).json({ message: "User has already sent you a friend request" })
			}
		}

		await createOutgoingFriendRequest(userId, friendId)

		return res.status(200).json({ message: "Friend request sent" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
