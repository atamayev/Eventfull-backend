import _ from "lodash"
import { Request, Response } from "express"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"

export default async function unfriendAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		await unfriendYourFriend(user._id, friend._id)

		if (!_.isEmpty(friend.username)) {
			return res.status(200).json({ success: `${friend.username} Un-friended` })
		}

		return res.status(200).json({ success: "User Un-friended" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
