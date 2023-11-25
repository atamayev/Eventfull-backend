import _ from "lodash"
import { google } from "googleapis"
import { Response, Request } from "express"
import signJWT from "../../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../../utils/auth-helpers/add-login-record"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"
import saveGoogleLoginTokens from "../../../utils/google/auth/save-google-login-tokens"
import createJWTPayload from "../../../utils/auth-helpers/create-jwt-payload"

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

		const userId = await saveGoogleLoginTokens(email, tokens)

		if (_.isNull(userId)) return res.status(500).json({ error: "Problem saving Google Login Tokens" })

		const payload = createJWTPayload(userId)

		const token = signJWT(payload)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

		await addLoginHistory(userId)

		return res.status(200).json({
			authenticated: true,
			accessToken: token
		})

	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "Internal Server Error: Failed to exchange authorization code for access token"
		})
	}
}
