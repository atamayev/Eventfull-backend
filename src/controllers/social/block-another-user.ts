import _ from "lodash"
import { Request, Response } from "express"
import blockUser from "../../utils/social/block/block-user"
import areUsersAreFriends from "../../utils/social/friend/are-users-are-friends"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import clearOutgoingFriendRequest from "../../utils/social/friend/clear-outgoing-friend-request"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"

export default async function blockAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const blockedUserId = req.blockedUserId
		const blockedUserUsername = req.blockedUserUsername

		if (_.isEqual(user._id, blockedUserId)) return res.status(400).json({ message: "You cannot block yourself" })

		await blockUser(user._id, blockedUserId)

		const areUsersFriends = areUsersAreFriends(user, blockedUserId)

		if (areUsersFriends === true) {
			await unfriendYourFriend(user._id, blockedUserId)
		}

		const doesOutgoingFriendRequestExists = checkIfOutgoingFriendRequestExists(user, blockedUserId)
		if (doesOutgoingFriendRequestExists === true) {
			await clearOutgoingFriendRequest(user._id, blockedUserId)
		}

		const doesIncomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, blockedUserId)
		if (doesIncomingFriendRequestExists === true) {
			await clearIncomingFriendRequest(user._id, blockedUserId)
		}

		if (!_.isEmpty(blockedUserUsername)) {
			return res.status(200).json({ message: `${blockedUserUsername} blocked` })
		}

		return res.status(200).json({ message: "User blocked" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
