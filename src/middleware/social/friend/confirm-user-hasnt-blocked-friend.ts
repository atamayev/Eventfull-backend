import { Request, Response, NextFunction } from "express"
import checkIfUserHasBlockedFriend from "../../../utils/social/block/check-if-user-has-blocked-friend"

export default function confirmUserHasntBlockedFriend (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		const isOtherUserBlocked = checkIfUserHasBlockedFriend(user, friend._id)

		if (isOtherUserBlocked === true) {
			const username = friend.username || "This User"
			return res.status(400).json({ message: `${username} is blocked` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User Blocked Friend" })
	}
}
