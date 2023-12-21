import _ from "lodash"
import { Response, Request } from "express"
import signJWT from "../../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../../utils/auth-helpers/add-login-record"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"
import saveGoogleLoginTokens from "../../../utils/google/auth/save-google-login-tokens"
import createJWTPayload from "../../../utils/auth-helpers/create-jwt-payload"

export default async function googleLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	try {
		const code = req.body.code as string
		const idToken = req.body.idToken as string
		const client = createGoogleAuthClient()
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID
		})
		const payload = ticket.getPayload()

		const { tokens } = await client.getToken(code)

		const userId = await saveGoogleLoginTokens(payload, tokens)

		if (_.isNull(userId)) return res.status(500).json({ error: "Problem saving Google Login Tokens" })

		const jwtPayload = createJWTPayload(userId)

		const token = signJWT(jwtPayload)
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
