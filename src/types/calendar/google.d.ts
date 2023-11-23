declare global {
	interface GoogleCalendarEvent {
		kind: string
		etag: string
		id: string
		status: string
		htmlLink: string
		created: string
		updated: string
		summary: string
		description: string
		location: string
		creator: GoogleCalendarEventCreator
		organizer: GoogleCalendarEventOrganizer
		start: GoogleCalendarEventDateTime
		end: GoogleCalendarEventDateTime
		recurrence?: string[]
		iCalUID: string
		sequence: number
		attendees?: GoogleCalendarEventAttendee[]
		reminders: {
			useDefault: boolean
		}
		attachments?: GoogleCalendarEventAttachment[]
		eventType: string
	}

	interface GoogleCalendarEventCreator {
		email: string
		self: boolean
	}

	interface GoogleCalendarEventOrganizer {
		email: string
		self: boolean
	}

	interface GoogleCalendarEventDateTime {
		date?: string
		dateTime?: string
		timeZone?: string
	}

	interface GoogleCalendarEventAttendee {
		email: string
		organizer?: boolean
		self?: boolean
		responseStatus: string
	}

	interface GoogleCalendarEventAttachment {
		fileUrl: string
		title: string
		mimeType: string
		iconLink: string
		fileId: string
	}
}

export {}
