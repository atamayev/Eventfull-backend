import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import findUser from "../../utils/find-user"

export default async function attachFriendToRequest(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const friendId = req.friendId
		const friend = await findUser(friendId)

		if (_.isNull(friend)) return res.status(400).json({ message: "Friend not found" })

		req.friend = friend as User
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Attach Friend to Request" })
	}
}
