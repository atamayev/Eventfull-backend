import createGoogleAuthClient from "./create-google-auth-client"

// This function fetches a new access token using a refresh token
export async function refreshGoogleToken(refreshToken: string): Promise<string | null | undefined> {
	const oauth2Client = createGoogleAuthClient()
	try {
		oauth2Client.setCredentials({
			refresh_token: refreshToken
		})

		const { credentials } = await oauth2Client.refreshAccessToken()

		const newAccessToken = credentials.access_token

		return newAccessToken
	} catch (error) {
		console.error("Error refreshing access token:", error)
		return null
	}
}
