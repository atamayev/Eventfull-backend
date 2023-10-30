import { Response, Request } from "express"
import createGoogleAuthClient from "../../../utils/create-google-auth-client"

export default function generateGoogleAuthUrl(req: Request, res: Response): Response {
	const oauth2Client = createGoogleAuthClient("http://localhost:8080/api/auth/google-auth/callback")

	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: [
			"https://www.googleapis.com/auth/calendar",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
			"openid"
		]
	})

	return res.status(200).json({ authUrl })
}
