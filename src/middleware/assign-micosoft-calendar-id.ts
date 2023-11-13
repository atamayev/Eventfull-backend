import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import UserModel from "../models/user-model"
import retrieveAndSetDefaultCalendarId from "../utils/microsoft/calendar-retrieval/retrieve-and-set-default-calendar-id"
import getValidMicrosoftCalendarAccessToken from "../utils/microsoft/calendar-retrieval/get-valid-microsoft-calendar-token"

export default async function assignMicrosoftCalendarId(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const userId = req.userId

		const user = await UserModel.findById(userId) as User

		let microsoftDefaultCalendarId = user.microsoftDefaultCalendarId
		if (_.isUndefined(microsoftDefaultCalendarId)) {
			const microsoftCalendarAccessToken = await getValidMicrosoftCalendarAccessToken(userId as unknown as Types.ObjectId)
			if (_.isUndefined(microsoftCalendarAccessToken)) {
				return res.status(401).json({ error: "Prompt user to give calendar access" })
			}

			microsoftDefaultCalendarId = await retrieveAndSetDefaultCalendarId(userId, microsoftCalendarAccessToken)
		}

		req.headers.microsoftDefaultCalendarId = microsoftDefaultCalendarId
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
