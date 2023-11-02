import { google } from "googleapis"
import { Response, Request } from "express"
import saveGoogleLoginTokens from "../../../utils/google/auth/save-google-login-tokens"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"

export default async function googleLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	const code = req.query.code as string

	try {
		const oauth2Client = createGoogleAuthClient("http://localhost:8080/api/auth/google-auth/login-callback")
		const { tokens } = await oauth2Client.getToken(code)
		oauth2Client.setCredentials(tokens)

		const oauth2 = google.oauth2({
			auth: oauth2Client,
			version: "v2"
		})

		const userInfo = await oauth2.userinfo.get()
		const email = userInfo.data.email || ""

		await saveGoogleLoginTokens(email, tokens)

		return res.status(200).json({
			authenticated: true,
			email,
			googleLoginAccessToken: tokens.access_token,
			googleLoginRefreshToken: tokens.refresh_token
		})

	} catch (error) {
		console.log(error)
		return res.status(500).json({
			error: "Internal Server Error: Failed to exchange authorization code for access token"
		})
	}
}
