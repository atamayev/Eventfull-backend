import _ from "lodash"
import { Request, Response } from "express"
import checkIfAlreadyFriends from "../../utils/social/check-if-already-friends"
import unfriendYourFriend from "../../utils/social/unfriend-your-friend"
import UserModel from "../../models/user-model"

export default async function unfriendAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId

		const friendUsername = await UserModel.findById(friendId).select("username")

		const isAlreadyFriends = await checkIfAlreadyFriends(userId, friendId)
		if (isAlreadyFriends === false) {
			return res.status(400).json({ message: "User is not your friend" })
		}

		await unfriendYourFriend(userId, friendId)

		if (!_.isNull(friendUsername) && !_.isUndefined(friendUsername.username)) {
			return res.status(200).json({ message: `${friendUsername.username} unfriended` })
		}

		return res.status(200).json({ message: "User unfriended" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
