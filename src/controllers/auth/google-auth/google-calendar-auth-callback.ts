import { Response, Request } from "express"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"
import saveGoogleCalendarTokens from "../../../utils/google/calendar-auth/save-google-calendar-tokens"

export default async function googleCalendarAuthCallback (req: Request, res: Response): Promise<Response> {
	const code = req.query.code as string
	const email = req.headers.email as string

	try {
		const oauth2Client = createGoogleAuthClient("http://localhost:8080/api/auth/google-auth/calendar-callback")
		const { tokens } = await oauth2Client.getToken(code)
		oauth2Client.setCredentials(tokens)

		await saveGoogleCalendarTokens(email, tokens)

		return res.status(200).json()

	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "Internal Server Error: Failed to exchange authorization code for access token"
		})
	}
}
