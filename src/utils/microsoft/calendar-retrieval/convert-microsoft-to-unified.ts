import _ from "lodash"

export function convertMicrosoftToUnified(events: MSCalendarEventResponse[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		const unifiedEvent: UnifiedCalendarEvent = {
			id: event.id,
			title: event.subject,
			description: event.bodyPreview,
			startDateTime: event.start.dateTime,
			endDateTime: event.end.dateTime,
			timeZone: event.start.timeZone,
			location: _.get(event, "location.displayName", ""),
			organizerEmail: _.get(event, "organizer.emailAddress.address", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: _.get(attendee, "emailAddress.address", ""),
				responseStatus: _.get(attendee, "status.response", "")
			})),
			isAllDay: event.isAllDay,
			recurrence: event.recurrence ? {
				pattern: event.recurrence.pattern.type,
				interval: event.recurrence.pattern.interval
			} : undefined,
			source: "microsoft",
			link: event.webLink
		}

		return unifiedEvent
	})
}
