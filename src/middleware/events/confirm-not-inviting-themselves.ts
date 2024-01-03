import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmNotInvitingThemselves (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const friend = req.friend

		if (_.isEqual(user._id, friend._id)) {
			return res.status(400).json({ message: "You cannot invite yourself" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm Users are Friends" })
	}
}
