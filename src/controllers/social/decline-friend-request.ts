import { Request, Response } from "express"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"

export default async function declineFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend

		await clearIncomingFriendRequest(user._id, friend._id)
		return res.status(200).json({ success: "Friend Request Declined" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Decline Friend Request" })
	}
}
