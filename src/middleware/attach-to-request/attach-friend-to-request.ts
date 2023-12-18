import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function attachFriendToRequest(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const friendId = req.friendId
		const friend = await UserModel.findById(friendId)

		if (_.isNull(friend)) return res.status(404).json({ error: "Friend not found" })

		req.friend = friend as User
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
