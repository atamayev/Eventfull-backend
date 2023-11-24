import _ from "lodash"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)
import { Event } from "@microsoft/microsoft-graph-types"

export default function convertMicrosoftToUnified(events: Event[]): UnifiedCalendarEvent[] {
	return events.map(event => {
		const formattedLocation = formatMicrosoftLocation(event)

		return {
			id: event.id || "",
			title: event.subject || "",
			description: event.bodyPreview || "",
			startDateTime: formatMicrosoftDateTime(event.start?.dateTime),
			endDateTime: formatMicrosoftDateTime(event.end?.dateTime),
			timeZone: event.start?.timeZone || "America/New_York",
			...(formattedLocation !== "" && { location: formattedLocation }),
			organizerEmail: _.get(event, "organizer.emailAddress.address", ""),
			attendees: _.map(event.attendees, attendee => ({
				email: _.get(attendee, "emailAddress.address", ""),
				responseStatus: _.get(attendee, "status.response", "none"),
			})),
			isAllDay: event.isAllDay || false,
			recurrence: getRecurrencePattern(event),
			source: "microsoft",
			link: event.webLink || "",
			isActive: true,
		}
	})
}

function formatMicrosoftDateTime(dateTime: string | undefined): UnifiedDateTime {
	if (_.isUndefined(dateTime)) return { date: "", time: "" }
	const newYorkTimeZone = "America/New_York"

	if (dateTime.endsWith("T00:00:00.0000000")) {
		const date = dateTime.split("T")[0]
		return { date, time: "00:00:00" }
	}

	const newYorkDateTime = dayjs.utc(dateTime).tz(newYorkTimeZone).format("YYYY-MM-DDTHH:mm:ss")
	const [date, time] = newYorkDateTime.split("T")
	return { date, time }
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
	console.log(event.location)

	return `${displayName}, ${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.countryOrRegion}`
}

function standardizeMicrosoftRecurrence(pattern: string): string {
	if (pattern === "daily") return "Daily"
	if (pattern === "weekly") return "Weekly"
	if (pattern === "absoluteMonthly" || pattern === "relativeMonthly") return "Monthly"
	if (pattern === "absoluteYearly" || pattern === "relativeYearly") return "Yearly"
	return "Custom"
}
