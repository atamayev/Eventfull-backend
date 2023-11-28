import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function saveIncomingUnifiedCalendarEvents(
	userId: Types.ObjectId,
	events: UnifiedCalendarEvent[]
): Promise<void> {
	const user = await UserModel.findById(userId)

	if (_.isNull(user)) throw new Error("User not found")

	for (const event of events) {
		const existingEvent = user.calendarData.find(e => e.id === event.id)

		if (_.isUndefined(existingEvent)) {
			await UserModel.updateOne(
				{ _id: userId },
				{ $push: { calendarData: event } }
			)
		} else {
			if (!areEventsEqual(existingEvent, event)) {
				await UserModel.updateOne(
					{ _id: userId, "calendarData.id": event.id },
					{ $set: { "calendarData.$": event } }
				)
			}
		}
	}
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
