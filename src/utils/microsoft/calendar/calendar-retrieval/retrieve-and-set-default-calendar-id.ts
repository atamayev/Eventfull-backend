import _ from "lodash"
import { Types } from "mongoose"
import { Calendar } from "@microsoft/microsoft-graph-types"
import createGraphClient from "../../create-graph-client"
import saveDefaultCalendarIdToDb from "./save-default-calendar-id-to-db"

export default async function retrieveAndSetDefaultCalendarId(
	userId: Types.ObjectId,
	microsoftCalendarAccessToken: string
): Promise<string | undefined> {
	const client = createGraphClient(microsoftCalendarAccessToken)

	try {
		const calendarResponse = await client.api("/me/calendars").get()
		const defaultCalendar = calendarResponse.value.find((calendar: Calendar) => calendar.isDefaultCalendar)
		const id = defaultCalendar ? defaultCalendar.id : undefined

		if (!_.isUndefined(id)) await saveDefaultCalendarIdToDb(userId, id as string)

		return id
	} catch (error) {
		console.error(error)
		throw new Error("Unable to retrieve and set default calendar ID")
	}
}
