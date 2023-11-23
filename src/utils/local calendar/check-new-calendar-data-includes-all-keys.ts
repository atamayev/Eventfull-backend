/* eslint-disable complexity */
import _ from "lodash"

export default function checkNewCalendarDataIncludesAllKeys(calendarDetails: UnifiedCalendarEvent[]): boolean {
	try {
		const requiredProps = ["title", "startDateTime", "endDateTime", "attendees", "isAllDay"]
		const stringProps = ["title", "description", "timeZone", "location", "organizerEmail", "link"]

		return calendarDetails.every(event => {
			if (!_.isObject(event) || !_.every(requiredProps, _.partial(_.has, event))) {
				return false
			}

			for (const prop of stringProps) {
				if (prop in event) {
					const key = prop as keyof UnifiedCalendarEvent
					const value = event[key]
					if (_.has(event, key) && !_.isString(value)) {
						return false
					}
				}
			}

			if (
				!isValidDateTime(event.startDateTime) ||
				!isValidDateTime(event.endDateTime) ||
				(!_.isArray(event.attendees)) ||
				(!_.isEmpty(event.attendees) && !isValidAttendee(event.attendees)) ||
				(event.recurrence && !isValidRecurrence(event.recurrence))
			) {
				return false
			}

			return true
		})
	} catch (error) {
		console.error(error)
		return false
	}
}

function isValidDateTime(dateTimeObj: UnifiedDateTime): boolean {
	return _.isObject(dateTimeObj) &&
           typeof dateTimeObj.date === "string" &&
           typeof dateTimeObj.time === "string"
}

function isValidAttendee(attendeeList: UnifiedCalendarAttendee[]): boolean {
	return attendeeList.every(attendeeObj => {
		return _.isObject(attendeeObj) &&
            typeof attendeeObj.email === "string" &&
            typeof attendeeObj.responseStatus === "string"
	})
}

function isValidRecurrence(recurrenceObj: UnifiedRecurrence): boolean {
	return _.isObject(recurrenceObj) &&
		typeof recurrenceObj.pattern === "string" &&
		typeof recurrenceObj.interval === "number"
}
