import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import acceptFriendRequest from "../../utils/social/accept-friend-request"
import checkIfFriendBlockedUser from "../../utils/social/check-if-friend-blocked-user"
import checkIfUsersAreFriends from "../../utils/social/check-if-users-are-friends"
import checkIfOutgoingFriendRequestExists from "../../utils/social/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/check-if-incoming-friend-request-exists"
import checkIfUserDoubleBlocking from "../../utils/social/check-if-user-double-blocking"
import clearIncomingFriendRequest from "../../utils/social/clear-incoming-friend-request"

// eslint-disable-next-line max-lines-per-function, complexity
export default async function respondToFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const response = req.body.response as "Accept" | "Decline"

		const friendUsername = await UserModel.findById(friendId).select("username")

		const isUserBlocked = await checkIfFriendBlockedUser(userId, friendId)
		if (isUserBlocked === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `${friendUsername.username} has blocked you` })
			} else {
				return res.status(400).json({ message: "User has blocked you" })
			}
		}

		const isFriendBlocked = await checkIfUserDoubleBlocking(friendId, userId)
		if (isFriendBlocked === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `You have blocked ${friendUsername.username}` })
			} else {
				return res.status(400).json({ message: "You have blocked the other user" })
			}
		}

		const alreadyFriends = await checkIfUsersAreFriends(userId, friendId)
		if (alreadyFriends === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `${friendUsername.username} is already your friend` })
			} else {
				return res.status(400).json({ message: "User is already your friend" })
			}
		}

		const outgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, friendId)
		if (outgoingFriendRequestExists === true) {
			return res.status(400).json({ message: "Friend request does not exist" })
		}

		const incomingFriendRequestExists = await checkIfIncomingFriendRequestExists(userId, friendId)
		if (incomingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend request does not exist" })
		}

		if (response === "Accept") {
			await acceptFriendRequest(userId, friendId)
		}

		await clearIncomingFriendRequest(friendId, userId)

		return res.status(200).json({ message: "Success" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal Server Error" })
	}
}
