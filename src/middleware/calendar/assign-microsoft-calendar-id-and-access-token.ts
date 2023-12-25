import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import retrieveAndSetDefaultCalendarId from "../../utils/microsoft/calendar/calendar-retrieval/retrieve-and-set-default-calendar-id"
import getValidMicrosoftCalendarAccessToken from "../../utils/microsoft/calendar/calendar-retrieval/get-valid-microsoft-calendar-token"

export default async function assignMicrosoftCalendarIdAndAccessToken(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const user = req.user

		const microsoftCalendarAccessToken = await getValidMicrosoftCalendarAccessToken(user)

		if (_.isUndefined(microsoftCalendarAccessToken)) {
			return res.status(401).json({ message: "Prompt user to give Microsoft calendar access" })
		}

		let microsoftDefaultCalendarId = user.microsoftDefaultCalendarId

		if (_.isUndefined(microsoftDefaultCalendarId)) {
			microsoftDefaultCalendarId = await retrieveAndSetDefaultCalendarId(user._id, microsoftCalendarAccessToken)

			if (_.isUndefined(microsoftDefaultCalendarId)) {
				return res.status(400).json({ message: "No Microsoft Calendar Id Found" })
			}
		}

		req.headers.microsoftDefaultCalendarId = microsoftDefaultCalendarId
		req.headers.microsoftCalendarAccessToken = microsoftCalendarAccessToken
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Assign Microsoft Calendar Access Token" })
	}
}
