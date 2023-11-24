import _ from "lodash"
import { Types } from "mongoose"
import { Calendar } from "@microsoft/microsoft-graph-types"
import saveDefaultCalendarIdToDb from "./save-default-calendar-id-to-db"
import createGraphClient from "../create-graph-client"

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
		throw new Error("Failed to retrieve and set default calendar ID")
	}
}
