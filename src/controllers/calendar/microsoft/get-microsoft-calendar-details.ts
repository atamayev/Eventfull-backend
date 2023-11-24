import _ from "lodash"
import { Response, Request } from "express"
import { Event } from "@microsoft/microsoft-graph-types"
import convertMicrosoftToUnified from "../../../utils/microsoft/calendar-retrieval/convert-microsoft-to-unified"
import saveOrUpdateUserCalendarEvents from "../../../utils/save-or-update-incoming-calendar-data"
import createGraphClient from "../../../utils/microsoft/create-graph-client"

export default async function getMicrosoftCalendarDetails(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const microsoftCalendarAccessToken = req.headers.microsoftCalendarAccessToken
		if (!_.isString(microsoftCalendarAccessToken)) {
			return res.status(400).json({ error: "Invalid Microsoft Calendar Access Token" })
		}

		const calendarId = req.headers.microsoftDefaultCalendarId as string
		const client = createGraphClient(microsoftCalendarAccessToken)

		const calendarDetails = await client.api(`/me/calendars/${calendarId}/events`).get() as { value: Event[] }

		const unifiedMicrosoftCalendarDetails = convertMicrosoftToUnified(calendarDetails.value)
		await saveOrUpdateUserCalendarEvents(userId, unifiedMicrosoftCalendarDetails)

		return res.status(200).json({ calendarDetails: unifiedMicrosoftCalendarDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to fetch Microsoft Calendar data" })
	}
}
