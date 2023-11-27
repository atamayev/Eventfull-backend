import _ from "lodash"
import { Request, Response } from "express"
import blockUser from "../../utils/social/block/block-user"
import UserModel from "../../models/user-model"
import checkIfUsersAreFriends from "../../utils/social/friend/check-if-users-are-friends"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import clearOutgoingFriendRequest from "../../utils/social/friend/clear-outgoing-friend-request"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function blockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const blockedUserId = req.blockedUserId

		const blockedUserUsername = await UserModel.findById(blockedUserId).select("username")

		if (userId === blockedUserId) return res.status(400).json({ message: "You cannot block yourself" })

		await blockUser(userId, blockedUserId)

		const areUsersFriends = await checkIfUsersAreFriends(userId, blockedUserId)

		if (areUsersFriends === true) {
			await unfriendYourFriend(userId, blockedUserId)
		}

		const doesOutgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, blockedUserId)
		if (doesOutgoingFriendRequestExists === true) {
			await clearOutgoingFriendRequest(userId, blockedUserId)
		}

		const doesIncomingFriendRequestExists = await checkIfIncomingFriendRequestExists(userId, blockedUserId)
		if (doesIncomingFriendRequestExists === true) {
			await clearIncomingFriendRequest(userId, blockedUserId)
		}


		if (!_.isNull(blockedUserUsername) && !_.isUndefined(blockedUserUsername.username)) {
			return res.status(200).json({ message: `${blockedUserUsername.username} blocked` })
		}

		return res.status(200).json({ message: "User blocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
