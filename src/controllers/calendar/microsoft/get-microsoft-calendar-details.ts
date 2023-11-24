import _ from "lodash"
import { Response, Request } from "express"
import axios, { AxiosResponse } from "axios"
import { Event } from "@microsoft/microsoft-graph-types"
import convertMicrosoftToUnified from "../../../utils/microsoft/calendar-retrieval/convert-microsoft-to-unified"
import saveOrUpdateUserCalendarEvents from "../../../utils/save-or-update-incoming-calendar-data"

export default async function getMicrosoftCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken
		if (_.isUndefined(microsoftCalendarAccessToken)) {
			return res.status(400).json({ error: "No Microsoft Calendar Access Token Found" })
		}

		const calendarId = req.headers.microsoftDefaultCalendarId as string

		const url = `https://graph.microsoft.com/v1.0/me/calendars/${calendarId}/events`
		const response: AxiosResponse<{ value: Event[] }> = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${microsoftCalendarAccessToken}`,
				"Content-Type": "application/json"
			}
		})

		const calendarDetails = response.data.value
		const unifiedMicrosoftCalendarDetails = convertMicrosoftToUnified(calendarDetails)
		await saveOrUpdateUserCalendarEvents(userId, unifiedMicrosoftCalendarDetails)

		return res.status(200).json({ calendarDetails: unifiedMicrosoftCalendarDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch Microsoft Calendar data" })
	}
}
