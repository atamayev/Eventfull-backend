import { Request, Response, NextFunction } from "express"
import checkIfIncomingFriendRequestExists from "../../../utils/social/friend/check-if-incoming-friend-request-exists"

export default function confirmIncomingFriendRequestExists (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		const incomingFriendRequestExists = checkIfIncomingFriendRequestExists(user, friend._id)
		if (incomingFriendRequestExists === false) {
			return res.status(400).json({ message: "Friend Request does not exist" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Friend Blocked User" })
	}
}
