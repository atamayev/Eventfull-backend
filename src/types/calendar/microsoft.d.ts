declare global {
	interface MSCalendarOwner {
		name: string
		address: string
	}

	interface MSCalendar {
		id: string
		name: string
		color: string
		hexColor: string
		isDefaultCalendar: boolean
		changeKey: string
		canShare: boolean
		canViewPrivateItems: boolean
		canEdit: boolean
		allowedOnlineMeetingProviders: string[]
		defaultOnlineMeetingProvider: string
		isTallyingResponses: boolean
		isRemovable: boolean
		owner: CalendarOwner
	}

	interface MSCalendarResponse {
		value: MSCalendar[]
	}

	interface MSCalendarEventResponse {
		"@odata.etag": string
		id: string
		createdDateTime: string
		lastModifiedDateTime: string
		changeKey: string
		categories: string[]
		transactionId: string
		originalStartTimeZone: string
		originalEndTimeZone: string
		iCalUId: string
		reminderMinutesBeforeStart: number
		isReminderOn: boolean
		hasAttachments: boolean
		subject: string
		bodyPreview: string
		importance: string
		sensitivity: string
		isAllDay: boolean
		isCancelled: boolean
		isOrganizer: boolean
		responseRequested: boolean
		seriesMasterId: string | null
		showAs: string
		type: string
		webLink: string
		onlineMeetingUrl: string | null
		isOnlineMeeting: boolean
		onlineMeetingProvider: string
		allowNewTimeProposals: boolean
		occurrenceId: string | null
		isDraft: boolean
		hideAttendees: boolean
		responseStatus: {
			response: string
			time: string
		}
		body: {
			contentType: string
			content: string
		}
		start: {
			dateTime: string
			timeZone: string
		}
		end: {
			dateTime: string
			timeZone: string
		}
		location: MSCalendarLocation
		locations: MSCalendarLocation[]
		recurrence: PatternedRecurrence | null
		attendees: MSCalendarAttendee[]
		organizer: MSCalendarPerson
		onlineMeeting: OnlineMeetingInfo | null
		"calendar@odata.associationLink": string
		"calendar@odata.navigationLink": string
	}

	interface MSCalendarLocation {
		displayName: string
		locationUri: string
		locationType: string
		uniqueId: string
		uniqueIdType: string
		address: MSCalendarAddress
		coordinates: MSCalendarCoordinates
	}

	interface MSCalendarAddress {
		street: string
		city: string
		state: string
		countryOrRegion: string
		postalCode: string
	}

	interface MSCalendarCoordinates {
		latitude: number
		longitude: number
	}

	interface MSCalendarAttendee {
		type: string
		status: {
			response: string
			time: string
		}
		emailAddress: MSCalendarEmailAddress
	}

	interface MSCalendarPerson {
		emailAddress: MSCalendarEmailAddress
	}

	interface MSCalendarEmailAddress {
		name: string
		address: string
	}

	interface OnlineMeetingInfo {
		onlineMeetingProvider: "unknown" | "teamsForBusiness" | "skypeForBusiness" | "skypeForConsumer";
	}

	interface PatternedRecurrence {
		pattern: RecurrencePattern
		range: RecurrenceRange
	}

	interface RecurrencePattern {
		type: string
		interval: number
		month: number
		dayOfMonth: number
		daysOfWeek: string[]
		firstDayOfWeek: string
		index: string
	}

	interface RecurrenceRange {
		type: string
		startDate: string
		endDate: string
		numberOfOccurrences: number
		recurrenceTimeZone: string
	}

}

export {}
