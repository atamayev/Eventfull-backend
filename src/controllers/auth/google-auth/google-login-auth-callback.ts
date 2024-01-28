import _ from "lodash"
import { Response, Request } from "express"
import addLoginRecord from "../../../utils/auth-helpers/add-login-record"
import doesUserHaveGoogleCalendar from "../../../utils/google/calendar/does-user-have-google-calendar"
import extractGoogleUserFromTokens from "../../../utils/google/auth/extract-google-user-from-tokens"
import createAndSignJWT from "../../../utils/auth-helpers/jwt/create-and-sign-jwt"

export default async function googleLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	try {
		const { idToken, code, notificationToken, primaryDevicePlatform } = req.body as GoogleLoginInformationObject

		const { tokensResonse, payload } = await extractGoogleUserFromTokens(idToken, code, primaryDevicePlatform, notificationToken)

		if (_.isUndefined(tokensResonse)) {
			return res.status(400).json({ message: "User with this email already exists, but is not a Google User"})
		}

		if (_.isNull(tokensResonse)) return res.status(500).json({ error: "Internal Server Error: Unable to Save Google Login Tokens" })

		const token = createAndSignJWT(tokensResonse.googleUser._id, tokensResonse.isNewUser)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		const isUserConnectedGoogleCalendar = await doesUserHaveGoogleCalendar(tokensResonse.googleUser._id)

		await addLoginRecord(tokensResonse.googleUser._id)

		return res.status(200).json({
			authenticated: true,
			accessToken: token,
			isUserConnectedGoogleCalendar,
			firstName: payload?.given_name,
			lastName: payload?.family_name,
			username: tokensResonse.googleUser.username,
			isNewUser: tokensResonse.isNewUser,
			email: payload?.email,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Exchange Authorization Code for Access Token" })
	}
}
