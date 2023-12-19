import _ from "lodash"
import { Request, Response } from "express"
import areUsersFriends from "../../utils/social/friend/are-users-friends"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"

export default async function unfriendAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		const isAlreadyFriends = areUsersFriends(user, friend._id)
		if (isAlreadyFriends === false) {
			if (!_.isEmpty(friend.username)) {
				return res.status(400).json({ message: `You are not friends with ${friend.username}` })
			}
			return res.status(400).json({ message: "You are not friends with this user" })
		}

		await unfriendYourFriend(user._id, friend._id)

		if (!_.isEmpty(friend.username)) {
			return res.status(200).json({ message: `${friend.username} unfriended` })
		}

		return res.status(200).json({ message: "User unfriended" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
