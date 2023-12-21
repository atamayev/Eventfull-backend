import { Response, Request } from "express"
import createGoogleAuthClient from "../../../utils/google/create-google-auth-client"

export default function generateGoogleCalendarAuthUrl(req: Request, res: Response): Response {
	try {
		const oauth2Client = createGoogleAuthClient("http://localhost:8080/api/auth/google-auth/calendar-callback")
		const accessToken = req.headers.authorization

		const stateData = {
			accessToken
		}

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: ["https://www.googleapis.com/auth/calendar"],
			state: JSON.stringify(stateData)
		})

		return res.status(200).json({ authUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Problem with generating Google Calendar Auth URL" })
	}
}
