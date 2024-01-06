import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default function confirmFriendHasntBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		const hasOtherUserBlockedMe = checkIfUserBlockedByFriend(user, friend._id)

		if (hasOtherUserBlockedMe === true) {
			const username = friend.username || "This user"
			return res.status(400).json({ message: `${username} has blocked you` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Friend Blocked User" })
	}
}
