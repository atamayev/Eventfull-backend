import { Request, Response } from "express"
import doesUsernameExist from "../../utils/auth-helpers/does-username-exist"
import UserModel from "../../models/user-model"

export default async function registerUsername(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const username = req.body.username

		const exists = await doesUsernameExist(username)

		if (exists === true) return res.status(400).json({ message: "Username taken" })

		await UserModel.findByIdAndUpdate(user._id, { username })

		return res.status(200).json({ success: "Username added" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Username Exists" })
	}
}
