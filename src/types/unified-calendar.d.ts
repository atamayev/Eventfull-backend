declare global {
	interface UnifiedCalendarEvent {
		source: AuthSources
		id: string
		title: string // From Google's 'summary' or Microsoft's 'subject'
		description?: string // From Google's 'description' or Microsoft's 'body.content'
		startDateTime: UnifiedDateTime // ISO date-time string
		endDateTime: UnifiedDateTime // ISO date-time string
		timeZone?: string
		location?: string // Simplified to just a string, could be from Google's or Microsoft's location fields
		organizerEmail?: string
		attendees: UnifiedCalendarAttendee[]
		isAllDay: boolean // From Microsoft's 'isAllDay', assume false if not present in Google data
		recurrence?: UnifiedRecurrence
		link?: string // From Google's 'htmlLink' or Microsoft's 'webLink'
		isActive: boolean
	}

	interface DatabaseUnifiedCalendarEvent extends UnifiedCalendarEvent {
		createdAt: Date
		updatedAt: Date
	}

	interface UnifiedDateTime {
		date: string
		time: string
	}

	interface UnifiedCalendarAttendee {
		email: string
		responseStatus?: string // Simplified version of Google's and Microsoft's response status
	}

	interface UnifiedRecurrence {
		pattern: string // Simplified version of recurrence pattern
		interval: number // Common interval value
	}
}

export {}
