import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function listBlockedUsers (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const blockedUsersIds = user.blockedUsers

		const userRequests = await UserModel.find({
			"_id": { $in: blockedUsersIds }
		}).select("username")

		const usernames = userRequests.map(user1 => user1.username)

		return res.status(200).json({ succes: usernames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to List Blocked Users" })
	}
}
