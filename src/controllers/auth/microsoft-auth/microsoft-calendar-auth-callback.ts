import { Response, Request } from "express"
import saveMicrosoftCalendarTokens from "../../../utils/microsoft/calendar-auth/save-microsoft-calendar-tokens"
import exchangeCodeForTokenCalendarCallback from "../../../utils/microsoft/calendar-auth/exchange-code-for-token-calendar-callback"

export default async function microsoftCalendarAuthCallback (req: Request, res: Response): Promise<Response> {
	const code = req.query.code as string
	const email = req.headers.email as string

	try {
		const tokenResponse = await exchangeCodeForTokenCalendarCallback(code)
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { access_token, refresh_token, expires_in } = tokenResponse.data

		await saveMicrosoftCalendarTokens(email, access_token, refresh_token, expires_in)

		return res.status(200).json()

	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "Internal Server Error: Failed to exchange authorization code for access token"
		})
	}
}