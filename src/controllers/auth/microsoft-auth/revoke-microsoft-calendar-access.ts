import { Request, Response } from "express"

export default async function revokeMicrosoftCalendarAccess(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		user.microsoftCalendarAccessToken = undefined
		user.microsoftCalendarRefreshToken = undefined
		user.microsoftCalendarAccessTokenExpiryDate = undefined
		user.microsoftDefaultCalendarId = undefined

		user.calendarData = user.calendarData.filter(event => event.source !== "microsoft")

		// Do more research to check to see if Microsoft has a revoke token endpoint
		await user.save()

		return res.status(200).json({ message: "Successfully revoked Microsoft Calendar access" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Revoke Microsoft Calendar Access" })
	}
}
