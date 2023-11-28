import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function listBlockedUsers (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId

		const blockedUsers = await UserModel.findById(userId).select("blockedUsers")

		if (_.isNull(blockedUsers)) {
			return res.status(400).json({ message: "User not found" })
		}
		const requestIds = blockedUsers.blockedUsers

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
