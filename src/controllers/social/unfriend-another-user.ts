import _ from "lodash"
import { Request, Response } from "express"
import areUsersAreFriends from "../../utils/social/friend/are-users-are-friends"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"

export default async function unfriendAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friendId = req.friendId
		const friendUsername = req.friendUsername

		const isAlreadyFriends = areUsersAreFriends(user, friendId)
		if (isAlreadyFriends === false) {
			if (!_.isEmpty(friendUsername)) {
				return res.status(400).json({ message: `You are not friends with ${friendUsername}` })
			}
			return res.status(400).json({ message: "You are not friends with this user" })
		}

		await unfriendYourFriend(user._id, friendId)

		if (!_.isEmpty(friendUsername)) {
			return res.status(200).json({ message: `${friendUsername} unfriended` })
		}

		return res.status(200).json({ message: "User unfriended" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
