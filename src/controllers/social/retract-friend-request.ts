import { Request, Response } from "express"
import clearOutgoingFriendRequest from "../../utils/social/friend/clear-outgoing-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"

export default async function retractFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId

		const outgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, friendId)
		if (outgoingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend request does not exist" })
		}

		await clearOutgoingFriendRequest(userId, friendId)

		return res.status(200).json({ message: "Friend request retracted" })

	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
