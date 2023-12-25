import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserHasEmail (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (_.isUndefined(user.email)) {
			return res.status(400).json({ message: "User does not have an Email Registered with Eventfull" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User has an Email" })
	}
}
