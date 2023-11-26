import _ from "lodash"
import { Request, Response } from "express"
import checkIfUserBlocked from "../../utils/social/check-if-user-blocked"
import UserModel from "../../models/user-model"
import checkIfAlreadyFriends from "../../utils/social/check-if-already-friends"
import createOutgoingFriendRequest from "../../utils/social/create-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/check-if-incoming-friend-request-exists"

// eslint-disable-next-line max-lines-per-function, complexity
export default async function sendFriendRequest (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId

		const friendUsername = await UserModel.findById(friendId).select("username")

		const isUserBlocked = await checkIfUserBlocked(userId, friendId)
		if (isUserBlocked === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `${friendUsername.username} has blocked you` })
			} else {
				return res.status(400).json({ message: "User has blocked you" })
			}
		}

		const alreadyFriends = await checkIfAlreadyFriends(userId, friendId)
		if (alreadyFriends === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `${friendUsername.username} is already your friend` })
			} else {
				return res.status(400).json({ message: "User is already your friend" })
			}
		}

		const outgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, friendId)
		if (outgoingFriendRequestExists === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `You have already sent a friend request to ${friendUsername.username}` })
			} else {
				return res.status(400).json({ message: "You have already sent a friend request to this user" })
			}
		}

		const incomingFriendRequestExists = await checkIfIncomingFriendRequestExists(userId, friendId)
		if (incomingFriendRequestExists === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `${friendUsername.username} has already sent you a friend request` })
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
