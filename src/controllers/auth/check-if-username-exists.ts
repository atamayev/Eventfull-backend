import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function checkIfUsernameExists(req: Request, res: Response): Promise<Response> {
	try {
		const username = req.body.username

		// Check if username exists (case insensitive)
		const user = await UserModel.findOne({
			username: { $regex: `^${username}$`, $options: "i" }
		})

		if (user === null) return res.status(200).json({ exists: false })

		return res.status(200).json({ exists: true })
	} catch (error) {
		console.error(error)
		return res.status(500).json()
	}
}
