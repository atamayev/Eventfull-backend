import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function listIncomingFriendRequests (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const incomingFriendRequests = await UserModel.findById(userId).select("incomingFriendRequests")

		if (_.isNull(incomingFriendRequests)) {
			return res.status(400).json({ message: "User not found" })
		}
		const requestIds = incomingFriendRequests.incomingFriendRequests

		const userRequests = await UserModel.find({
			"_id": { $in: requestIds }
		}).select("username -_id")

		const usernames = userRequests.map(user => user.username)

		return res.status(200).json({ usernames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
}
