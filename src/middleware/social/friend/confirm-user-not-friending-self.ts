import { Request, Response, NextFunction } from "express"

export default function confirmUserNotFriendingSelf (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		if (user._id.toString() === friend._id.toString()) {
			return res.status(400).json({ message: "You cannot send yourself a friend request" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User is attempting to friend self" })
	}
}
