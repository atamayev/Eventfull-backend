import _ from "lodash"
import { Response, Request } from "express"
import signJWT from "../../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../../utils/auth-helpers/add-login-record"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"
import saveGoogleLoginTokens from "../../../utils/google/auth/save-google-login-tokens"
import createJWTPayload from "../../../utils/auth-helpers/create-jwt-payload"
import doesUserHaveGoogleCalendar from "../../../utils/google/calendar/does-user-have-google-calendar"
import fetchLoginUserData from "../../../utils/auth-helpers/fetch-login-user-data"

// eslint-disable-next-line max-lines-per-function
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

		const tokensResonse = await saveGoogleLoginTokens(payload, tokens)

		if (_.isUndefined(tokensResonse)) {
			return res.status(400).json({ message: "User with this email already exists, but is not a Google User"})
		}

		if (_.isNull(tokensResonse)) return res.status(500).json({ error: "Internal Server Error: Unable to Save Google Login Tokens" })

		const jwtPayload = createJWTPayload(tokensResonse.googleUser._id)

		const token = signJWT(jwtPayload)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		const isUserConnectedGoogleCalendar = await doesUserHaveGoogleCalendar(tokensResonse.googleUser._id)

		await addLoginHistory(tokensResonse.googleUser._id)

		const { friends, incomingFriendRequests, outgoingFriendRequests, blockedUsers } = await fetchLoginUserData(tokensResonse.googleUser)

		return res.status(200).json({
			authenticated: true,
			accessToken: token,
			isUserConnectedGoogleCalendar,
			firstName: payload?.given_name,
			lastName: payload?.family_name,
			username: tokensResonse.googleUser.username,
			isNewUser: tokensResonse.isNewUser,
			email: payload?.email,
			friends,
			incomingFriendRequests,
			outgoingFriendRequests,
			blockedUsers,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Exchange Authorization Code for Access Token" })
	}
}
