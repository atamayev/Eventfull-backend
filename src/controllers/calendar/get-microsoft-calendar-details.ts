import _ from "lodash"
import { Response, Request } from "express"
import axios, { AxiosResponse } from "axios"

export default async function getMicrosoftCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken
		if (_.isUndefined(microsoftCalendarAccessToken)) {
			return res.status(400).json({ error: "No Microsoft Calendar Access Token Found" })
		}

		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const url = `https://graph.microsoft.com/v1.0/me/calendars/${calendarId}/events`
		const response: AxiosResponse = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${microsoftCalendarAccessToken}`,
				"Content-Type": "application/json"
			}
		})

		const calendarDetails = response.data.value as MSCalendarEventResponse[]

		return res.status(200).json({ calendarDetails: calendarDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch Microsoft Calendar data" })
	}
}
