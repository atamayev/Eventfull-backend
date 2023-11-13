import { Response, Request } from "express"
import cca from "../../../utils/microsoft/msal-config"

export default async function generateMicrosoftLoginAuthUrl(req: Request, res: Response): Promise<Response> {
	try {
		const authUrl = await cca.getAuthCodeUrl({
			scopes: ["openid", "email", "profile", "offline_access"],
			redirectUri: "http://localhost:8080/api/auth/microsoft-auth/login-callback",
		})

		return res.status(200).json({ authUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Error generating the auth URL" })
	}
}
