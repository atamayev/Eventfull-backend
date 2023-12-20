import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserHasPhoneVerificationCode (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (_.isUndefined(user.phoneVerificationCode)) {
			return res.status(400).json({ error: "User does not have a Phone Number Registered with Eventfull" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Confirm if User has a Phone Number" })
	}
}
