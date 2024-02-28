import { Request, Response } from "express"
import acceptFriendRequestHelper from "../../utils/social/friend/accept-friend-request-helper"

export default async function acceptFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend
		const createdAt = req.body.createdAt

		await acceptFriendRequestHelper(user, friend, createdAt)

		return res.status(200).json({ success: "Friend Request Accepted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Accept Friend Request" })
	}
}
