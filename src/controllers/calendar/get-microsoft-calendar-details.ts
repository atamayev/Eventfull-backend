import _ from "lodash"
import { Types } from "mongoose"
import { Response, Request } from "express"
import axios, { AxiosResponse } from "axios"
import getValidMicrosoftCalendarAccessToken from "../../utils/microsoft/calendar-retrieval/get-valid-microsoft-calendar-token"

export default async function getMicrosoftCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.headers.userid as string
		const microsoftCalendarAccessToken = await getValidMicrosoftCalendarAccessToken(userId as unknown as Types.ObjectId)
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
