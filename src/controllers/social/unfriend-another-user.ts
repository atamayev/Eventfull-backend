import { Request, Response } from "express"
import unfriendYourFriend from "../../utils/social/friend/unfriend-your-friend"

export default async function unfriendAnotherUser (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		await unfriendYourFriend(user._id, friend._id)

		const username = friend.username || "User"
		return res.status(200).json({ success: `${username} Un-friended` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
