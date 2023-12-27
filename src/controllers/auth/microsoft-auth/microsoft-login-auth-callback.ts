import _ from "lodash"
import { Response, Request } from "express"
import addLoginHistory from "../../../utils/auth-helpers/add-login-record"
import verifyIdToken from "../../../utils/microsoft/verify-id-token"
import saveMicrosoftLoginTokens from "../../../utils/microsoft/auth/save-microsoft-login-tokens"
import exchangeCodeForTokenLoginCallback from "../../../utils/microsoft/auth/exchange-code-for-token-login-callback"
import createAndSignJWT from "../../../utils/auth-helpers/jwt/create-and-sign-jwt"

export default async function microsoftLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	try {
		const code = req.query.code as string
		const tokenResponse = await exchangeCodeForTokenLoginCallback(code)
		const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data

		const userClaims = await verifyIdToken(id_token)
		if (_.isUndefined(userClaims)) {
			return res.status(500).json({ error: "Internal Server Error: Unable to Authenticate Microsoft Token"})
		}

		const email = userClaims["email"] as string

		const userId = await saveMicrosoftLoginTokens(email, access_token, refresh_token, expires_in)

		if (_.isNull(userId)) return res.status(500).json({ error: "Internal Server Error: Unable to save Microsoft Login Tokens" })

		const token = createAndSignJWT(userId)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await addLoginHistory(userId)

		return res.status(200).json({
			authenticated: true,
			accessToken: token
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Exchange Authorization Code for Access Token" })
	}
}
