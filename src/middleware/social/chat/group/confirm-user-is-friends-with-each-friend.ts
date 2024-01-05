import { Request, Response, NextFunction } from "express"
import areUsersFriends from "../../../../utils/social/friend/are-users-friends"

export default function confirmUserIsFriendsWithEachFriend (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friends = req.friends

		for (const friend of friends) {
			const isAlreadyFriends = areUsersFriends(user, friend._id)

			if (isAlreadyFriends === false) {
				const username = friend.username || "this user"
				return res.status(400).json({ message: `You are not friends with ${username}` })
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Users are Friends" })
	}
}
