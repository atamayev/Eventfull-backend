declare global {
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
		eventStartTime: Date
		eventEndTime: Date
		eventPrice: number
		eventType: string
		isVirtual: boolean
		organizer?: SocialData
		isActive: boolean
		eventPublic: boolean
		eventReviewable: boolean
		canInvitedUsersInviteOthers: boolean
		eventDuration: EventDuration
		eventURL?: string
		extraEventCategories?: string[]
		eventDescription?: string
		address?: string
		eventImageURL?: string
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
