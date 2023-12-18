import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function changeColorTheme(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { colorTheme } = req.body

		await UserModel.findByIdAndUpdate(user._id, { colorTheme })
		return res.status(200).json({ message: `Color theme changed to ${colorTheme}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Server error" })
	}
}
