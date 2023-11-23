import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkNewCalendarDataIncludesAllKeys from "../../../utils/local calendar/check-new-calendar-data-includes-all-keys"

export default function validateAddLocalCalendarDataRequest (req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.body) {
		return res.status(400).json({ error: "Bad Request: Missing or invalid body" })
	}

	const calendarDetails = req.body.calendarDetails
	if (_.isEmpty(calendarDetails) || !_.isArray(calendarDetails)) {
		return res.status(400).json({ error: "Bad Request: Missing or invalid Calendar Information" })
	}

	const isCalendarDataClean = checkNewCalendarDataIncludesAllKeys(calendarDetails)

	if (isCalendarDataClean === false) return res.status(400).json({ error: "Bad Request: Missing required fields" })

	next()
}
