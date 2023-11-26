import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function searchForUsername(req: Request, res: Response): Promise<Response> {
	try {
		const username = req.params.username as string

		// eslint-disable-next-line security/detect-non-literal-regexp
		const regex = new RegExp(username, "i")

		const users = await UserModel.find({ username: regex })
			.select("username -_id")
			.limit(10)

		const usernames = users.map(user => user.username)

		return res.status(200).json({ usernames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error })
	}
}
