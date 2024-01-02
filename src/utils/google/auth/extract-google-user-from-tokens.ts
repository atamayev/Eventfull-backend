import { TokenPayload } from "google-auth-library"
import createGoogleAuthClient from "../create-google-auth-client"
import saveGoogleLoginTokens from "./save-google-login-tokens"

type GoogleLoginTokensResponseWithPayload = {
	tokensResonse: GoogleLoginTokensResponse | undefined | null
	payload: TokenPayload | undefined
}

export default async function extractGoogleUserFromTokens(
	idToken: string,
	code: string,
	primaryDevicePlatform: DevicePlatforms,
	notificationToken: string
): Promise<GoogleLoginTokensResponseWithPayload> {
	const client = createGoogleAuthClient()
	const ticket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID
	})
	const payload = ticket.getPayload()

	const { tokens } = await client.getToken(code)

	const tokensResonse = await saveGoogleLoginTokens(payload, tokens, primaryDevicePlatform, notificationToken)

	return {
		tokensResonse,
		payload
	}
}
