import _ from "lodash"
import { Types } from "mongoose"
import cca from "../../msal-config"
import updateMicrosoftCalendarTokensInDB from "./update-microsoft-calendar-tokens-in-db"

export default async function refreshMicrosoftCalendarToken(userId: Types.ObjectId, refreshToken: string): Promise<string | null> {
	try {
		const tokenRequest = {
			refreshToken,
			scopes: ["Calendars.ReadWrite, offline_access"],
		}

		const authenticationResult = await cca.acquireTokenByRefreshToken(tokenRequest)
		if (_.isNull(authenticationResult)) return null

		await updateMicrosoftCalendarTokensInDB(userId, authenticationResult)
		const newAccessToken = authenticationResult.accessToken

		return newAccessToken
	} catch (error) {
		console.error("Error refreshing the Microsoft access token:", error)
		return null
	}
}
