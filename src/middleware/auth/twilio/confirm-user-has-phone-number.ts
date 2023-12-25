import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserHasPhoneNumber (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (_.isUndefined(user.phoneNumber)) {
			return res.status(400).json({ message: "User does not have a Phone Number Registered with Eventfull" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User has a Phone Number" })
	}
}
