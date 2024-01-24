import _ from "lodash"
import UserModel from "../../models/user-model"

export default async function saveIncomingUnifiedCalendarEvents(
	user: User,
	events: UnifiedCalendarEvent[],
	source: CloudAuthSources
): Promise<void> {
	const eventMap = new Map(events.map(event => [event.id, event]))

	const eventsToDelete = user.calendarData
		.filter(event => event.source === source && !eventMap.has(event.id))

	if (!_.isEmpty(eventsToDelete)) {
		await UserModel.findByIdAndUpdate(
			user._id,
			{ $pull: { calendarData: { id: { $in: eventsToDelete.map(event => event.id) } } } },
			{ runValidators: true }
		)
	}

	for (const event of events) {
		const existingEvent = user.calendarData.find(e => e.id === event.id)

		if (_.isUndefined(existingEvent)) {
			await UserModel.findByIdAndUpdate(
				user._id,
				{ $push: { calendarData: event } },
				{ runValidators: true }
			)
		} else {
			if (areEventsEqual(existingEvent, event) === false) {
				await UserModel.updateOne(
					{ _id: user._id, "calendarData.id": event.id },
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
