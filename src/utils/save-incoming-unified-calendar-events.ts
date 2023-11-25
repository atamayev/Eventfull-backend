import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../models/user-model"

export default async function saveIncomingUnifiedCalendarEvents(
	userId: Types.ObjectId,
	events: UnifiedCalendarEvent[]
): Promise<void> {
	const user = await UserModel.findById(userId)

	if (_.isNull(user)) throw new Error("User not found")

	for (const event of events) {
		const existingEventIndex = user.calendarData.findIndex(e => e.id === event.id)

		if (existingEventIndex > -1) {
			// Compare existing event with new event data
			if (areEventsEqual(user.calendarData[existingEventIndex], event) === false) {
				// Update the existing event
				user.calendarData[existingEventIndex] = event
			}
		} else {
			// Add new event to user"s calendarData
			user.calendarData.push(event)
		}
	}

	await user.save()
}

function areEventsEqual(existingEvent: UnifiedCalendarEvent, newEvent: UnifiedCalendarEvent): boolean {
	// Define which fields you want to compare
	const fieldsToCompare = [
		"title", "description", "startDateTime", "endDateTime", "timeZone",
		"location", "organizerEmail", "attendees", "isAllDay", "recurrence", "link"
	]

	for (const field of fieldsToCompare) {
		if (!_.isEqual(_.get(existingEvent, field), _.get(newEvent, field))) {
			return false
		}
	}

	return true
}
