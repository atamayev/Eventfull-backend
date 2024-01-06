import { Request, Response, NextFunction } from "express"
import checkIfUserHasBlockedFriend from "../../../../utils/social/block/check-if-user-has-blocked-friend"

export default function confirmUserHasntBlockedAnyFriend (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friends = req.friends

		for (const friend of friends) {
			const isOtherUserBlocked = checkIfUserHasBlockedFriend(user, friend._id)

			if (isOtherUserBlocked === true) {
				const username = friend.username || "this user"
				return res.status(400).json({ message: `You have blocked ${username}` })
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User Blocked Friend" })
	}
}
