import { Request, Response, NextFunction } from "express"

export default function confirmUserPhoneNotVerified (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (user.isPhoneVerified === true) {
			return res.status(400).json({ message: "User's Phone has already been verified" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User's Phone has already been verified" })
	}
}
