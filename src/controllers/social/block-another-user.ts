import _ from "lodash"
import { Request, Response } from "express"
import blockUser from "../../utils/social/block/block-user"
import NotificationHelper from "../../classes/notification-helper"
import areUsersFriends from "../../utils/social/friend/are-users-friends"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import clearOutgoingFriendRequest from "../../utils/social/friend/clear-outgoing-friend-request"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function blockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const blockedUser = req.blockedUser

		if (_.isEqual(user._id, blockedUser._id)) return res.status(400).json({ message: "You cannot block yourself" })

		await blockUser(user, blockedUser)

		const areBothUsersFriends = areUsersFriends(user, blockedUser._id)

		if (areBothUsersFriends === true) {
			await unfriendYourFriend(user._id, blockedUser._id)
		}

		const doesOutgoingFriendRequestExists = checkIfOutgoingFriendRequestExists(user, blockedUser._id)
		if (doesOutgoingFriendRequestExists === true) {
			await clearOutgoingFriendRequest(user, blockedUser)
			NotificationHelper.retractFriendRequest(user._id, blockedUser._id)
		}

		const doesIncomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, blockedUser._id)
		if (doesIncomingFriendRequestExists === true) {
			await clearIncomingFriendRequest(user._id, blockedUser._id)
		}

		// TODO: Figure out how to handle one user blocking another when they are in:
		// 1. A group chat
		// 2. A private chat
		// Change the logic in the direct message and group chat middleware

		const username = blockedUser.username || "User"
		return res.status(200).json({ success: `${username} blocked` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Block Other user" })
	}
}
