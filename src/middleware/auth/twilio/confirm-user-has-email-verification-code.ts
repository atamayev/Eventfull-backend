import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserHasEmailVerificationCode (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (_.isUndefined(user.emailVerificationCode)) {
			return res.status(400).json({ error: "User does not have an Email Verification Code" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Confirm if User has a Phone Number" })
	}
}
