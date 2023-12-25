import _ from "lodash"
import { Request, Response } from "express"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"

export default async function revokeGoogleCalendarAccess(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const oauth2Client = createGoogleAuthClient()

		if (!_.isUndefined(user.googleCalendarRefreshToken)) {
			await oauth2Client.revokeToken(user.googleCalendarRefreshToken)
		}

		user.googleCalendarAccessToken = undefined
		user.googleCalendarAccessTokenExpiryDate = undefined
		user.googleCalendarRefreshToken = undefined
		user.calendarData = user.calendarData.filter(event => event.source !== "Google")

		await user.save()

		return res.status(200).json({ success: "Revoked Google Calendar access" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unabe to Revoke Google Calendar Access" })
	}
}
