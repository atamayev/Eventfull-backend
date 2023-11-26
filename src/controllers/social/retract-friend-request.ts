import _ from "lodash"
import { Request, Response } from "express"
import checkIfAlreadyFriends from "../../utils/social/check-if-already-friends"
import UserModel from "../../models/user-model"
import clearFriendRequest from "../../utils/social/clear-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/check-if-outgoing-friend-request-exists"

export default async function retractFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId

		const friendUsername = await UserModel.findById(friendId).select("username")

		const alreadyFriends = await checkIfAlreadyFriends(userId, friendId)
		if (alreadyFriends === true) {
			if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
				return res.status(400).json({ message: `${friendUsername.username} is already your friend` })
			} else {
				return res.status(400).json({ message: "User is already your friend" })
			}
		}

		const outgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, friendId)
		if (outgoingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend request does not exist" })
		}

		await clearFriendRequest(userId, friendId)

		return res.status(200).json({ message: "Friend request retracted" })

	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
