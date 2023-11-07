import _ from "lodash"
import cca from "./msal-config"

export default async function acquireMicrosoftAuthToken(email: string | undefined): Promise<string | null> {
	if (_.isUndefined(email)) return null

	const tokenRequest = {
		scopes: ["openid", "profile"],
		account: cca.getAccountByUsername(email)
	}

	try {
		const response = await cca.acquireTokenSilent(tokenRequest)
		return response.accessToken
	} catch (error) {
		console.error(error)
		return null
	}
}
