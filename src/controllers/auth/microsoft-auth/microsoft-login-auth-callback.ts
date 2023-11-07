import _ from "lodash"
import { Response, Request } from "express"
import { signJWT } from "../../../utils/auth-helpers/register-helpers"
import addLoginHistory from "../../../utils/auth-helpers/add-login-record"
import exchangeCodeForToken from "../../../utils/microsoft/exchange-code-for-token"
import verifyIdToken from "../../../utils/microsoft/verify-id-token"
import saveMicrosoftLoginTokens from "../../../utils/microsoft/auth/save-microsoft-login-tokens"

export default async function microsoftLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	const code = req.query.code as string

	try {
		const tokenResponse = await exchangeCodeForToken(code)
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data

		const userClaims = await verifyIdToken(id_token)
		if (_.isUndefined(userClaims)) return res.status(400).json({error: "Problem authenticating Microsoft Token"})

		const email = userClaims["email"] as string

		const userId = await saveMicrosoftLoginTokens(email, access_token, refresh_token, expires_in)

		if (_.isNull(userId)) return res.status(500).json({ error: "Problem saving Microsoft Login Tokens" })

		const payload: JwtPayload = {
			userId: _.toString(userId),
			newUser: false
		}

		const token = signJWT(payload)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

		await addLoginHistory(_.toString(userId))

		return res.status(200).json({
			authenticated: true,
			accessToken: token
		})
	} catch (error) {
		return res.status(500).json({error: "Internal Server Error"})
	}
}
