import { calendar_v3 } from "@googleapis/calendar"

export default function convertUnifiedToGoogle(unifiedEvent: UnifiedCalendarEvent): calendar_v3.Schema$Event {
	const formatGoogleDateTime = (date: Date, isAllDay: boolean, timeZone: string | undefined): calendar_v3.Schema$EventDateTime => {
		if (isAllDay === true) {
			return { date: date.toISOString().split("T")[0] }
		}
		return { dateTime: date.toISOString(), timeZone: timeZone }
	}

	const googleEvent: calendar_v3.Schema$Event = {
		id: unifiedEvent.id,
		summary: unifiedEvent.title,
		description: unifiedEvent.description,
		start: formatGoogleDateTime(unifiedEvent.eventTime.startTime, unifiedEvent.isAllDay, unifiedEvent.timeZone),
		end: formatGoogleDateTime(unifiedEvent.eventTime.endTime, unifiedEvent.isAllDay, unifiedEvent.timeZone),
		location: unifiedEvent.location,
		attendees: unifiedEvent.attendees.map(attendee => ({
			email: attendee.email,
			responseStatus: attendee.responseStatus,
		})),
		recurrence: unifiedEvent.recurrence ? mapRecurrenceToGoogle(unifiedEvent.recurrence) : null,
		htmlLink: unifiedEvent.link,
	}

	return googleEvent
}

function mapRecurrenceToGoogle(unifiedRecurrence: UnifiedRecurrence): string[] {
	const recurrenceMappings: { [key: string]: string } = {
		"Daily": "DAILY",
		"Weekly": "WEEKLY",
		"Monthly": "MONTHLY",
		"Yearly": "YEARLY",
		// Placeholder, adjust based on how you handle custom patterns:
		"Custom": "DAILY"
	}

	let rrule = "RRULE:FREQ="
	const pattern = recurrenceMappings[unifiedRecurrence.pattern]

	if (!pattern) {
		throw new Error("Unknown recurrence pattern")
	}

	rrule += pattern

	// Add INTERVAL to the rule, if applicable
	if (unifiedRecurrence.interval && unifiedRecurrence.interval > 1) {
		rrule += `;INTERVAL=${unifiedRecurrence.interval}`
	}

	return [rrule]
}
