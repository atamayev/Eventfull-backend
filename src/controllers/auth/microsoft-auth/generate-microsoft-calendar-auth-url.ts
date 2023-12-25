import { Response, Request } from "express"
import cca from "../../../utils/microsoft/msal-config"

export default async function generateMicrosoftCalendarAuthUrl(req: Request, res: Response): Promise<Response> {
	try {
		const accessToken = req.headers.authorization

		const stateData = {
			accessToken
		}

		const authUrl = await cca.getAuthCodeUrl({
			scopes: ["Calendars.ReadWrite", "offline_access"],
			state: JSON.stringify(stateData),
			redirectUri: "http://localhost:8080/api/auth/microsoft-auth/calendar-callback",
			responseMode: "query",
			prompt: "select_account",
		})

		return res.status(200).json({ authUrl })

	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Error generating the auth URL" })
	}
}
