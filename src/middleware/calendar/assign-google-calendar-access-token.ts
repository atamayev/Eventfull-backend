import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getValidGoogleCalendarAccessToken from "../../utils/google/calendar/calendar-retrieval/get-valid-google-calendar-token"

export default async function assignGoogleCalendarAccessToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const user = req.user
		const googleCalendarAccessToken = await getValidGoogleCalendarAccessToken(user)
		if (_.isUndefined(googleCalendarAccessToken)) {
			return res.status(400).json({ message: "No Google Calendar Access Token Found" })
		}

		req.headers.googleCalendarAccessToken = googleCalendarAccessToken
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Assign Google Calendar Access Token" })
	}
}
