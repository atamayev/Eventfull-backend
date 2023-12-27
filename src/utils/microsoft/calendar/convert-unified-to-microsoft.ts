import _ from "lodash"
import {
	Event,
	PatternedRecurrence,
	RecurrencePattern,
	RecurrenceRange,
	RecurrencePatternType,
	ResponseType
} from "@microsoft/microsoft-graph-types"

export default function convertUnifiedToMicrosoft(unifiedEvent: UnifiedCalendarEvent): Event {
	const combineDateTime = (dateTime: UnifiedDateTime): string => `${dateTime.date}T${dateTime.time}`

	const defaultTimeZone = "America/New_York"

	const microsoftEvent: Event = {
		id: unifiedEvent.id,
		subject: unifiedEvent.title,
		bodyPreview: unifiedEvent.description,
		start: {
			dateTime: combineDateTime(unifiedEvent.startDateTime),
			timeZone: unifiedEvent.timeZone || defaultTimeZone
		},
		end: {
			dateTime: combineDateTime(unifiedEvent.endDateTime),
			timeZone: unifiedEvent.timeZone || defaultTimeZone
		},
		location: {
			displayName: unifiedEvent.location,
		},
		organizer: {
			emailAddress: {
				address: unifiedEvent.organizerEmail
			}
		},
		attendees: unifiedEvent.attendees.map(attendee => ({
			emailAddress: {
				address: attendee.email
			},
			status: {
				response: mapResponseStatusToMicrosoft(attendee.responseStatus)
			}
		})),
		isAllDay: unifiedEvent.isAllDay,
		recurrence: reverseRecurrencePattern(unifiedEvent.recurrence),
		webLink: unifiedEvent.link
	}

	return microsoftEvent
}

function mapResponseStatusToMicrosoft(responseStatus: string | undefined): ResponseType {
	const responseMapping: { [key: string]: ResponseType } = {
		"Accepted": "accepted",
		"Declined": "declined",
		"TentativelyAccepted": "tentativelyAccepted",
		"Default": "notResponded"
	}

	return responseMapping[responseStatus || "Default"]
}

function reverseRecurrencePattern(unifiedRecurrence: UnifiedRecurrence | undefined): PatternedRecurrence | undefined {
	if (_.isUndefined(unifiedRecurrence)) return undefined

	const patternType = mapUnifiedPatternToMicrosoft(unifiedRecurrence.pattern)

	const recurrencePattern: RecurrencePattern = {
		type: patternType,
		interval: unifiedRecurrence.interval,
	}

	const recurrenceRange: RecurrenceRange = {
		type: "noEnd",
	}

	return {
		pattern: recurrencePattern,
		range: recurrenceRange
	}
}

function mapUnifiedPatternToMicrosoft(pattern: string): RecurrencePatternType {
	const patternMapping: { [key: string]: RecurrencePatternType } = {
		"Daily": "daily",
		"Weekly": "weekly",
		"Monthly": "absoluteMonthly",
		"Yearly": "absoluteYearly",
		"Custom": "daily"
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return patternMapping[pattern] || "daily"
}
