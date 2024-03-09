import _ from "lodash"
import { calendar_v3 } from "@googleapis/calendar"

export default function convertGoogleToUnified(events: calendar_v3.Schema$Event[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		const timeZone = event.start?.timeZone || "America/New_York"

		return {
			id: event.id || "",
			title: event.summary || "",
			description: event.description || "",
			eventTime: formatGoogleDateTime(event.start, event.end),
			timeZone: timeZone,
			location: event.location || "",
			organizerEmail: _.get(event, "organizer.email", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: attendee.email || "",
				responseStatus: attendee.responseStatus || "needsAction",
			})),
			isAllDay: isAllDayEvent(event),
			recurrence: getRecurrencePattern(event),
			source: "Google",
			link: event.htmlLink || "",
			isActive: true,
		}
	})
}

function isAllDayEvent(event: calendar_v3.Schema$Event): boolean {
	return _.has(event.start, "date") && _.has(event.end, "date")
}

function formatGoogleDateTime(
	startDateTime: calendar_v3.Schema$EventDateTime | undefined,
	endDateTime: calendar_v3.Schema$EventDateTime | undefined
): CalendarBaseEventTime {
	const fallbackDate = new Date()

	const parseDateTime = (dateTime: calendar_v3.Schema$EventDateTime | undefined): Date => {
		if (_.isUndefined(dateTime)) return fallbackDate
		if (dateTime.dateTime) {
			return new Date(dateTime.dateTime)
		} else if (dateTime.date) {
			return new Date(dateTime.date)
		} else {
			return fallbackDate
		}
	}

	return {
		startTime: parseDateTime(startDateTime),
		endTime: parseDateTime(endDateTime),
	}
}

function getRecurrencePattern(event: calendar_v3.Schema$Event): UnifiedRecurrence | undefined {
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
