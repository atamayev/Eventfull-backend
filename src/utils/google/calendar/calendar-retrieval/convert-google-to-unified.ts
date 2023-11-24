import _ from "lodash"
import { calendar_v3 } from "googleapis"

export default function convertGoogleToUnified(events: calendar_v3.Schema$Event[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		const timeZone = event.start?.timeZone || "America/New_York"

		return {
			id: event.id || "",
			title: event.summary || "",
			description: event.description || "",
			startDateTime: formatGoogleDateTime(event.start),
			endDateTime: formatGoogleDateTime(event.end),
			timeZone: timeZone,
			location: event.location || "",
			organizerEmail: _.get(event, "organizer.email", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: attendee.email || "",
				responseStatus: attendee.responseStatus || "needsAction",
			})),
			isAllDay: isAllDayEvent(event),
			recurrence: getRecurrencePattern(event),
			source: "google",
			link: event.htmlLink || "",
			isActive: true,
		}
	})
}

function isAllDayEvent(event: calendar_v3.Schema$Event): boolean {
	return _.has(event.start, "date") && _.has(event.end, "date")
}

function formatGoogleDateTime(dateTime: calendar_v3.Schema$EventDateTime | undefined): UnifiedDateTime {
	if (_.isNil(dateTime)) return { date: "", time: "" }

	if (!_.isNil(dateTime.date)) return { date: dateTime.date, time: "00:00:00" }

	if (!_.isNil(dateTime.dateTime)) {
		const [date, timeWithZ] = dateTime.dateTime.split("T")
		const time = timeWithZ.split("Z")[0]

		return { date, time }
	}

	return { date: "", time: "" }
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
