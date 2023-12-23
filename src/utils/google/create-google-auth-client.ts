import { OAuth2Client } from "google-auth-library"

export default function createGoogleAuthClient(): OAuth2Client {
	return new OAuth2Client(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET
	)
}
