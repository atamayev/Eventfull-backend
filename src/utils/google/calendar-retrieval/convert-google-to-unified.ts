import _ from "lodash"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

export default function convertGoogleToUnified(events: GoogleCalendarEvent[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		return {
			id: event.id,
			title: event.summary,
			description: event.description || "",
			startDateTime: formatGoogleDateTime(event.start),
			endDateTime: formatGoogleDateTime(event.end),
			timeZone: event.start.timeZone || "UTC",
			location: event.location,
			organizerEmail: _.get(event, "organizer.email", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: attendee.email,
				responseStatus: attendee.responseStatus || "needsAction",
			})),
			isAllDay: isAllDayEvent(event),
			recurrence: getRecurrencePattern(event),
			source: "google",
			link: event.htmlLink,
			isActive: true,
		}
	})
}

function isAllDayEvent(event: GoogleCalendarEvent): boolean {
	return _.has(event.start, "date") && _.has(event.end, "date")
}

function formatGoogleDateTime(dateTime: GoogleCalendarEventDateTime): UnifiedDateTime {
	if (!_.isUndefined(dateTime.date)) return { date: dateTime.date, time: "00:00:00" }

	if (!_.isUndefined(dateTime.dateTime)) {
		const [date, timeWithZ] = dateTime.dateTime.split("T")
		const time = timeWithZ.split("Z")[0]

		return { date, time }
	}

	return { date: "", time: "" }
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
