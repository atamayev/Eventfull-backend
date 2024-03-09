import _ from "lodash"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)
import { Event, DateTimeTimeZone } from "@microsoft/microsoft-graph-types"

export default function convertMicrosoftToUnified(events: Event[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		const formattedLocation = formatMicrosoftLocation(event)
		const eventTime = formatMicrosoftDateTime(event.start, event.end)

		return {
			id: event.id || "",
			title: event.subject || "",
			description: event.bodyPreview || "",
			eventTime,
			timeZone: event.start?.timeZone || "America/New_York",
			...(formattedLocation !== "" && { location: formattedLocation }),
			organizerEmail: _.get(event, "organizer.emailAddress.address", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: _.get(attendee, "emailAddress.address", ""),
				responseStatus: _.get(attendee, "status.response", "none"),
			})),
			isAllDay: event.isAllDay || false,
			recurrence: getRecurrencePattern(event),
			source: "Microsoft",
			link: event.webLink || "",
			isActive: true,
		}
	})
}

function formatMicrosoftDateTime(
	startDateTime: DateTimeTimeZone | null | undefined,
	endDateTime: DateTimeTimeZone | null | undefined
): CalendarBaseEventTime {
	const parseDateTime = (dateTime: DateTimeTimeZone | null | undefined): Date => {
		if (!dateTime || !dateTime.dateTime) return new Date()
		const timeZone = dateTime.timeZone || "America/New_York"
		return dayjs(dateTime.dateTime).tz(timeZone).toDate()
	}

	return {
		startTime: parseDateTime(startDateTime),
		endTime: parseDateTime(endDateTime),
	}
}

function getRecurrencePattern(event: Event): UnifiedRecurrence | undefined {
	if (
		_.isNil(event.recurrence) ||
		_.isNil(event.recurrence.pattern) ||
		_.isNil(event.recurrence.pattern.type) ||
		_.isNil(event.recurrence.pattern.interval)
	) return undefined

	return {
		pattern: standardizeMicrosoftRecurrence(event.recurrence.pattern.type),
		interval: event.recurrence.pattern.interval
	}
}

function formatMicrosoftLocation(event: Event): string {
	if (_.isNil(event.location) || _.isNil(event.location.displayName) || _.isEmpty(event.location.displayName)) return ""

	const { displayName, address } = event.location
	if (_.isNil(address)) return displayName

	if (address.countryOrRegion === "United States") address.countryOrRegion = "USA"

	return `${displayName}, ${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.countryOrRegion}`
}

function standardizeMicrosoftRecurrence(pattern: string): string {
	if (pattern === "daily") return "Daily"
	if (pattern === "weekly") return "Weekly"
	if (pattern === "absoluteMonthly" || pattern === "relativeMonthly") return "Monthly"
	if (pattern === "absoluteYearly" || pattern === "relativeYearly") return "Yearly"
	return "Custom"
}
