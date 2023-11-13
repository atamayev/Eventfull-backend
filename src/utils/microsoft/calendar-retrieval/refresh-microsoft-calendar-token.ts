import _ from "lodash"
import cca from "../msal-config"
import { Types } from "mongoose"
import updateMicrosoftCalendarTokensInDB from "./update-microsoft-calendar-tokens-in-db"

export default async function refreshMicrosoftCalendarToken(userId: Types.ObjectId, refreshToken: string): Promise<string | null> {
	try {
		const tokenRequest = {
			refreshToken,
			scopes: ["Calendars.ReadWrite, offline_access"],
		}

		const authenticationResult = await cca.acquireTokenByRefreshToken(tokenRequest)
		if (_.isNull(authenticationResult)) return null

		const newAccessToken = authenticationResult.accessToken

		await updateMicrosoftCalendarTokensInDB(userId, authenticationResult)

		return newAccessToken
	} catch (error) {
		console.error("Error refreshing the Microsoft access token:", error)
		return null
	}
}
