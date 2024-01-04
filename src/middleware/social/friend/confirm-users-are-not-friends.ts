import { Request, Response, NextFunction } from "express"
import areUsersFriends from "../../../utils/social/friend/are-users-friends"

export default function confirmUsersAreNotFriends (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		const alreadyFriends = areUsersFriends(user, friend._id)

		if (alreadyFriends === true) {
			const username = friend.username || "this user"
			return res.status(400).json({ message: `You are already friends with ${username}` })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Users are Friends" })
	}
}
