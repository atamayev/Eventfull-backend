import { Request, Response, NextFunction } from "express"

export default function confirmUserEmailNotVerified (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (user.isEmailVerified === true) {
			return res.status(400).json({ error: "User's Email has already been verified" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Confirm if User's Email has already been verified" })
	}
}
