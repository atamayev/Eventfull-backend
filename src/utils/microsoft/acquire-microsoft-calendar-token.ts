import _ from "lodash"
import cca from "./msal-config"

export default async function acquireMicrosoftCalendarToken(email: string): Promise<string | null> {
	if (_.isUndefined(email)) return null

	const tokenRequest = {
		scopes: [
			"https://graph.microsoft.com/Calendars.Read",
			"https://graph.microsoft.com/Calendars.ReadWrite"
		],
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
