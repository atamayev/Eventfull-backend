import _ from "lodash"
import axios, { AxiosResponse } from "axios"
import saveDefaultCalendarIdToDb from "./save-default-calendar-id-to-db"

export default async function retrieveAndSetDefaultCalendarId(
	userId: string,
	microsoftCalendarAccessToken: string
): Promise<string | undefined> {
	const url = "https://graph.microsoft.com/v1.0/me/calendars"

	const response: AxiosResponse = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${microsoftCalendarAccessToken}`,
			"Content-Type": "application/json"
		}
	})

	const calendarResponse: MSCalendarResponse = response.data
	console.log(calendarResponse)
	const defaultCalendar = calendarResponse.value.find(calendar => calendar.isDefaultCalendar)
	const id =  defaultCalendar ? defaultCalendar.id : undefined

	if (!_.isUndefined(id)) await saveDefaultCalendarIdToDb(userId, id as string)

	return id
}


