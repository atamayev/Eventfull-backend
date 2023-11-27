import { Request, Response } from "express"
import acceptFriendRequest from "../../utils/social/friend/accept-friend-request"
import checkIfOutgoingFriendRequestExists from "../../utils/social/friend/check-if-outgoing-friend-request-exists"
import checkIfIncomingFriendRequestExists from "../../utils/social/friend/check-if-incoming-friend-request-exists"
import clearIncomingFriendRequest from "../../utils/social/friend/clear-incoming-friend-request"

export default async function respondToFriendRequest(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const response = req.body.response as AcceptOrDecline

		const outgoingFriendRequestExists = await checkIfOutgoingFriendRequestExists(userId, friendId)
		if (outgoingFriendRequestExists === true) {
			return res.status(400).json({ message: "Friend request does not exist" })
		}

		const incomingFriendRequestExists = await checkIfIncomingFriendRequestExists(userId, friendId)
		if (incomingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend request does not exist" })
		}

		if (response === "Accept") {
			await acceptFriendRequest(userId, friendId)
		}

		await clearIncomingFriendRequest(userId, friendId)

		if (response === "Accept") {
			return res.status(200).json({ message: "Friend request accepted" })
		} else {
			return res.status(200).json({ message: "Friend request declined" })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal Server Error" })
	}
}
