import { Request, Response, NextFunction } from "express"
import checkIfUserHasBlockedFriend from "../../../utils/social/block/check-if-user-has-blocked-friend"

export default function checkIfUserBlockedBlockedUser (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const blockedUser = req.blockedUser

		const isOtherUserBlocked = checkIfUserHasBlockedFriend(user, blockedUser._id)

		if (isOtherUserBlocked === true) {
			const username = blockedUser.username || "This User"
			return res.status(400).json({ message: `${username} is already blocked` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User Blocked Blocked User" })
	}
}
