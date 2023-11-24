import { calendar_v3 } from "googleapis"

export default function convertUnifiedToGoogleCalendarEvent(unifiedEvent: UnifiedCalendarEvent): calendar_v3.Schema$Event {
	// Helper function to combine date and time into ISO string
	const combineDateTime = (dateTime: UnifiedDateTime): string => `${dateTime.date}T${dateTime.time}`
	const defaultTimeZone = "America/New_York"

	const googleEvent: calendar_v3.Schema$Event = {
		id: unifiedEvent.id,
		summary: unifiedEvent.title,
		description: unifiedEvent.description,
		start: unifiedEvent.isAllDay ?
			{ date: unifiedEvent.startDateTime.date } :
			{ dateTime: combineDateTime(unifiedEvent.startDateTime), timeZone: unifiedEvent.timeZone || defaultTimeZone },
		end: unifiedEvent.isAllDay ?
			{ date: unifiedEvent.endDateTime.date } :
			{ dateTime: combineDateTime(unifiedEvent.endDateTime), timeZone: unifiedEvent.timeZone || defaultTimeZone },
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
		"Custom": "DAILY" // Placeholder, adjust based on how you handle custom patterns
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
