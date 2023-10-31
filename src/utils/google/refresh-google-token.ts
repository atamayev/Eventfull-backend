import { Types } from "mongoose"
import updateUserTokensInDB from "./update-user-tokens-in-db"
import createGoogleAuthClient from "./create-google-auth-client"

// This function fetches a new access token using a refresh token
export async function refreshGoogleToken(userId: Types.ObjectId, refreshToken: string): Promise<string | null | undefined> {
	try {
		const oauth2Client = createGoogleAuthClient()
		oauth2Client.setCredentials({
			refresh_token: refreshToken
		})

		const { credentials } = await oauth2Client.refreshAccessToken()

		const newAccessToken = credentials.access_token

		await updateUserTokensInDB(userId, credentials)

		return newAccessToken
	} catch (error) {
		console.error("Error refreshing access token:", error)
		return null
	}
}
