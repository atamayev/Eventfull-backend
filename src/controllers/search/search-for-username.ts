import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function searchForUsername(req: Request, res: Response): Promise<Response> {
	try {
		const username = req.params.username as string
		const user = req.user

		const blockedIds = [...user.blockedUsers, ...user.blockedByUsers, user._id]

		// eslint-disable-next-line security/detect-non-literal-regexp
		const regex = new RegExp(username, "i")

		const users = await UserModel.find({
			// Exclude users in the blocked lists:
			_id: { $nin: blockedIds },
			username: regex
		})
			.select("username -_id")
			.limit(10)

		return res.status(200).json({ users })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error })
	}
}
