import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserHasGoogleCalendar (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		if (_.isUndefined(user.googleCalendarAccessToken)) {
			return res.status(400).json({ error: "User does not have Google Calendar access" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
