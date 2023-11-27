import _ from "lodash"
import { Request, Response } from "express"
import checkIfFriendBlockedUser from "../../utils/social/check-if-friend-blocked-user"
import checkIfUsersAreFriends from "../../utils/social/check-if-users-are-friends"
import createOutgoingFriendRequest from "../../utils/social/create-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/check-if-incoming-friend-request-exists"
import checkIfUserBlocked from "../../utils/social/check-if-user-blocked"

// eslint-disable-next-line max-lines-per-function, complexity
export default async function sendFriendRequest (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const isUserBlocked = await checkIfFriendBlockedUser(userId, friendId)
		if (isUserBlocked === true) {
			if (!_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: `${friendUsername} has blocked you` })
			} else {
				return res.status(400).json({ message: "User has blocked you" })
			}
		}

		const isFriendBlocked = await checkIfUserBlocked(userId, friendId)
		if (isFriendBlocked === true) {
			if (!_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: `You have blocked ${friendUsername}` })
			} else {
				return res.status(400).json({ message: "You have blocked the other user" })
			}
		}

		const alreadyFriends = await checkIfUsersAreFriends(userId, friendId)
		if (alreadyFriends === true) {
			if (!_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: `${friendUsername} is already your friend` })
			} else {
				return res.status(400).json({ message: "User is already your friend" })
			}
		}

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
