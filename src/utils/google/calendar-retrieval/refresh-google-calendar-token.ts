import { Types } from "mongoose"
import createGoogleAuthClient from "../create-google-auth-client"
import updateGoogleCalendarTokensInDB from "./update-google-calendar-tokens-in-db"

export default async function refreshGoogleCalendarToken(userId: Types.ObjectId, refreshToken: string): Promise<string | null | undefined> {
	try {
		const oauth2Client = createGoogleAuthClient()
		oauth2Client.setCredentials({
			refresh_token: refreshToken
		})

		const { credentials } = await oauth2Client.refreshAccessToken()

		const newAccessToken = credentials.access_token

		await updateGoogleCalendarTokensInDB(userId, credentials)

		return newAccessToken
	} catch (error) {
		console.error("Error refreshing access token:", error)
		return null
	}
}
