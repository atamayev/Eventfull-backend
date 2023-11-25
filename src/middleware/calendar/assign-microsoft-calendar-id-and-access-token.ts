import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../models/user-model"
import retrieveAndSetDefaultCalendarId from "../../utils/microsoft/calendar/calendar-retrieval/retrieve-and-set-default-calendar-id"
import getValidMicrosoftCalendarAccessToken from "../../utils/microsoft/calendar/calendar-retrieval/get-valid-microsoft-calendar-token"

export default async function assignMicrosoftCalendarIdAndAccessTokenAndAccessToken(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId

		const user = await UserModel.findById(userId) as User

		const microsoftCalendarAccessToken = await getValidMicrosoftCalendarAccessToken(userId)

		if (_.isUndefined(microsoftCalendarAccessToken)) {
			return res.status(401).json({ error: "Prompt user to give Microsoft calendar access" })
		}

		let microsoftDefaultCalendarId = user.microsoftDefaultCalendarId

		if (_.isUndefined(microsoftDefaultCalendarId)) {
			microsoftDefaultCalendarId = await retrieveAndSetDefaultCalendarId(userId, microsoftCalendarAccessToken)

			if (_.isUndefined(microsoftDefaultCalendarId)) {
				return res.status(400).json({ error: "No Microsoft Calendar Id Found" })
			}
		}

		req.headers.microsoftDefaultCalendarId = microsoftDefaultCalendarId
		req.headers.microsoftCalendarAccessToken = microsoftCalendarAccessToken
		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
