import _ from "lodash"

export function convertMicrosoftToUnified(events: MSCalendarEventResponse[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		return {
			id: event.id,
			title: event.subject,
			description: event.bodyPreview || "",
			startDateTime: formatMicrosoftDateTime(event.start.dateTime),
			endDateTime: formatMicrosoftDateTime(event.end.dateTime),
			timeZone: "UTC",
			location: formatMicrosoftLocation(event),
			organizerEmail: _.get(event, "organizer.emailAddress.address", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: _.get(attendee, "emailAddress.address", ""),
				responseStatus: _.get(attendee, "status.response", "none"),
			})),
			isAllDay: event.isAllDay || false,
			recurrence: getRecurrencePattern(event),
			source: "microsoft",
			link: event.webLink
		}
	})
}

function formatMicrosoftDateTime(dateTime: string): string {
	if (dateTime.endsWith("T00:00:00.0000000")) return dateTime.split("T")[0]
	return dateTime
}

function getRecurrencePattern(event: MSCalendarEventResponse): UnifiedRecurrence | undefined {
	if (_.isNull(event.recurrence)) return undefined

	return {
		pattern: standardizeMicrosoftRecurrence(event.recurrence.pattern.type),
		interval: event.recurrence.pattern.interval
	}
}

// Function to format location for Microsoft events
function formatMicrosoftLocation(event: MSCalendarEventResponse): string {
	if (!event.location) return ""

	const { displayName, address } = event.location
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
