import _ from "lodash"
import { Response, Request } from "express"
import signJWT from "../../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../../utils/auth-helpers/add-login-record"
import verifyIdToken from "../../../utils/microsoft/verify-id-token"
// import saveMicrosoftLoginTokens from "../../../utils/microsoft/auth/save-microsoft-login-tokens"
import exchangeCodeForTokenLoginCallback from "../../../utils/microsoft/auth/exchange-code-for-token-login-callback"
import createJWTPayload from "../../../utils/auth-helpers/create-jwt-payload"
import { Types } from "mongoose"

export default async function microsoftLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	try {
		const code = req.query.code as string
		const tokenResponse = await exchangeCodeForTokenLoginCallback(code)
		const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data

		const userClaims = await verifyIdToken(id_token)
		if (_.isUndefined(userClaims)) return res.status(400).json({error: "Problem authenticating Microsoft Token"})

		const email = userClaims["email"] as string

		// const userId = await saveMicrosoftLoginTokens(email, access_token, refresh_token, expires_in)
		const userId = new Types.ObjectId("123")

		if (_.isNull(userId)) return res.status(500).json({ error: "Problem saving Microsoft Login Tokens" })

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
