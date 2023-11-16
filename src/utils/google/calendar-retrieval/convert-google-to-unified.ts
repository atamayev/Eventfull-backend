import _ from "lodash"

export function convertGoogleToUnified(events: GoogleCalendarEvent[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		const isAllDayEvent = _.has(event.start, "date") && _.has(event.end, "date")
		const startDateTime = isAllDayEvent ? _.get(event.start, "date", "") : _.get(event.start, "dateTime", "")
		const endDateTime = isAllDayEvent ? _.get(event.end, "date", "") : _.get(event.end, "dateTime", "")

		const unifiedEvent: UnifiedCalendarEvent = {
			id: event.id,
			title: event.summary,
			description: event.description,
			startDateTime: startDateTime,
			endDateTime: endDateTime,
			timeZone: isAllDayEvent ? "" : _.get(event.start, "timeZone", ""),
			location: event.location,
			organizerEmail: event.organizer.email,
			attendees: _.get(event, "attendees", []).map(attendee => ({
				email: attendee.email,
				responseStatus: attendee.responseStatus
			})),
			isAllDay: isAllDayEvent,
			recurrence: event.recurrence ? {
				pattern: _.first(event.recurrence) || "N/A",
				interval: extractInterval(_.first(event.recurrence) || "")
			} : undefined,
			source: "google",
			link: event.htmlLink
		}

		return unifiedEvent
	})
}

function extractInterval(recurrenceRule: string): number {
	const match = recurrenceRule.match(/INTERVAL=(\d+)/)
	return match ? parseInt(match[1], 10) : 1
}
