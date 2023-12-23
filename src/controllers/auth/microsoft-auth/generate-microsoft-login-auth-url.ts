import { Response, Request } from "express"
import cca from "../../../utils/microsoft/msal-config"

export default async function generateMicrosoftLoginAuthUrl(req: Request, res: Response): Promise<Response> {
	try {
		const authUrl = await cca.getAuthCodeUrl({
			scopes: ["openid", "email", "profile", "offline_access"],
			// redirectUri: "http://localhost:8080/api/auth/microsoft-auth/login-callback",
			redirectUri: "msauth://com.anonymous.eventfullfrontend/Xo8WBi6jzSxKDVR4drqm84yr9iU%3D",
		})

		return res.status(200).json({ authUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Error generating the auth URL" })
	}
}
