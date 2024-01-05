import { Request, Response, NextFunction } from "express"
import checkIfUserBlockedByFriend from "../../../utils/social/block/check-if-user-blocked-by-friend"

export default function confirmFriendsHaveNotBlockedEachother(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const friends = req.friends

		for (let i = 0; i < friends.length; i++) {
			for (let j = i + 1; j < friends.length; j++) {
				const friend1 = friends[i]
				const friend2 = friends[j]

				const hasFriend1BlockedFriend2 = checkIfUserBlockedByFriend(friend1, friend2._id)
				const hasFriend2BlockedFriend1 = checkIfUserBlockedByFriend(friend2, friend1._id)

				// eslint-disable-next-line max-depth
				if (hasFriend1BlockedFriend2 || hasFriend2BlockedFriend1) {
					const username1 = friend1.username || "one user"
					const username2 = friend2.username || "another user"
					return res.status(400).json({ message: `${username1} has blocked ${username2}` })
				}
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Friends Blocked Each Other" })
	}
}
