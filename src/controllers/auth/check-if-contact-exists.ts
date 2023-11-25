import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import emailOrPhone from "../../utils/email-or-phone"

export default async function checkIfContactExists(req: Request, res: Response): Promise<Response> {
	try {
		const username = req.body.contact
		const usernameType = emailOrPhone(username)

		if (usernameType === "unknown") return res.status(400).json({ error: "Please enter a valid email or phone number" })

		else if (usernameType === "email") {
			const user = await UserModel.findOne({
				email: { $regex: `^${username}$`, $options: "i" }
			})

			if (user === null) return res.status(200).json({ exists: false })

			return res.status(200).json({ exists: true })
		}

		else {
			const user = await UserModel.findOne({
				phone: { $regex: `^${username}$`, $options: "i" }
			})

			if (user === null) return res.status(200).json({ exists: false })

			return res.status(200).json({ exists: true })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json()
	}
}
