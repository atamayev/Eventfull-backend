import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function listBlockedUsers (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const blockedUsersIds = user.blockedUsers

		const blockedUsers = await UserModel.find({
			"_id": { $in: blockedUsersIds }
		}).select("_id username")

		return res.status(200).json({ blockedUsers })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Blocked Users" })
	}
}
