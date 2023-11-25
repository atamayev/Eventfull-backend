import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getValidGoogleCalendarAccessToken from "../../utils/google/calendar/calendar-retrieval/get-valid-google-calendar-token"

export default async function assignGoogleCalendarId(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const userId = req.userId
		const googleCalendarAccessToken = await getValidGoogleCalendarAccessToken(userId)
		if (_.isUndefined(googleCalendarAccessToken)) {
			return res.status(400).json({ error: "No Google Calendar Access Token Found" })
		}

		req.headers.googleCalendarAccessToken = googleCalendarAccessToken
		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
