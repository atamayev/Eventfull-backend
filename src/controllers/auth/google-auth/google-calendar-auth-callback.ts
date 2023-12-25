import { Response, Request } from "express"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"
import saveGoogleCalendarTokens from "../../../utils/google/calendar/calendar-auth/save-google-calendar-tokens"

export default async function googleCalendarAuthCallback (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const code = req.body.code as string
		const client = createGoogleAuthClient()
		const { tokens } = await client.getToken(code)

		const userEmail = user.email as string
		await saveGoogleCalendarTokens(userEmail, tokens)

		return res.status(200).json({ success: "Google Calendar Auth Callback Successful" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to exchange authorization code for access token" })
	}
}
