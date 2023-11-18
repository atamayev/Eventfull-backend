import _ from "lodash"

export function convertGoogleToUnified(events: GoogleCalendarEvent[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		return {
			id: event.id,
			title: event.summary,
			description: event.description || "",
			startDateTime: getStartDateTime(event),
			endDateTime: getEndDateTime(event),
			timeZone: "UTC",
			location: event.location,
			organizerEmail: _.get(event, "organizer.email", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: attendee.email,
				responseStatus: attendee.responseStatus || "needsAction",
			})),
			isAllDay: isAllDayEvent(event),
			recurrence: getRecurrencePattern(event),
			source: "google",
			link: event.htmlLink
		}
	})
}

function isAllDayEvent(event: GoogleCalendarEvent): boolean {
	return _.has(event.start, "date") && _.has(event.end, "date")
}

function getStartDateTime(event: GoogleCalendarEvent): string {
	return isAllDayEvent(event) ? _.get(event.start, "date", "") : _.get(event.start, "dateTime", "")
}

function getEndDateTime(event: GoogleCalendarEvent): string {
	return isAllDayEvent(event) ? _.get(event.end, "date", "") : _.get(event.end, "dateTime", "")
}

function getRecurrencePattern(event: GoogleCalendarEvent): UnifiedRecurrence | undefined {
	if (_.isUndefined(event.recurrence)) return undefined

	const recurrenceRule = _.first(event.recurrence) || ""
	const pattern = standardizeGoogleRecurrence(recurrenceRule)
	const interval = parseInt(_.get(recurrenceRule.match(/INTERVAL=(\d+)/), "[1]", "1"), 10)

	return { pattern, interval }
}

function standardizeGoogleRecurrence(pattern: string): string {
	if (pattern.includes("DAILY")) return "Daily"
	else if (pattern.includes("WEEKLY")) return "Weekly"
	else if (pattern.includes("MONTHLY")) return "Monthly"
	else if (pattern.includes("YEARLY")) return "Yearly"
	return "Custom"
}
