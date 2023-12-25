import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function changeColorTheme(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { colorTheme } = req.body

		await UserModel.findByIdAndUpdate(user._id, { colorTheme }, { runValidators: true })
		return res.status(200).json({ success: `Color theme changed to ${colorTheme}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Change Color Theme" })
	}
}
