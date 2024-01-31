declare global {
	type EventFrequency = "one-time" | "custom" | "ongoing"

	type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

	interface BaseEventTime {
		startTime: Date
		endTime: Date
		eventDuration: {
			hours: number
			minutes: number
		}
	}

	interface OngoingEvents extends BaseEventTime {
		dayOfWeek: DayOfWeek
	}

	interface EventCategory extends IDInterface {
		eventCategory: string
		description: string
	}

	interface EventType extends IDInterface {
		name: string
		description: string
		// Categories should be of type eventCategory[]
		categories: string[]
	}

	interface EventfullCalendarEvent extends TimestampsInterface {
		eventId: Types.ObjectId
		attendingStatus: AttendingStatuses
		invitedBy?: SocialDataWithTimestamp
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullInvitee {
		user: SocialData
		attendingStatus: "Not Attending" | "Not Responded"
		invitedBy: SocialDataWithTimestamp
	}

	interface EventfullAttendee {
		user: SocialData
		invitedBy?: SocialDataWithTimestamp
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullCoHost {
		user: SocialData
		invitedBy: SocialDataWithTimestamp
	}

	interface CreatedBy {
		userId: Types.ObjectId
		username: string
		createdAt: Date
		isCreatedByAdmin: boolean
	}

	interface EventDuration {
		hours: number
		minutes: number
	}

	interface BaseEventfullEvent {
		eventName: string
		eventPrice: number
		eventType: string
		isVirtual: boolean
		isActive: boolean
		eventPublic: boolean
		eventReviewable: boolean
		canInvitedUsersInviteOthers: boolean
		eventFrequency: EventFrequency
		address: string
		eventDescription: string
		organizer?: SocialData
		eventURL?: string
		extraEventCategories?: string[]
		eventImageURL?: string

		// For one-time events:
		singularEventTime?: BaseEventTime | null

		// For custom events:
		customEventDates?: BaseEventTime[]

		// For ongoing events:
		ongoingEventTimes?: OngoingEvents[]
	}

	interface EventfullEvent extends BaseEventfullEvent, IDInterface {
		invitees: EventfullInvitee[]
		coHosts: EventfullCoHost[]
		attendees: EventfullAttendee[]
		eventCapacity: number | null
		createdBy?: CreatedBy
	}

	interface IncomingEventfullEvent extends BaseEventfullEvent {
		invitees: SocialData[]
		coHosts: SocialData[]
		eventCapacity?: number
	}
}

export {}
