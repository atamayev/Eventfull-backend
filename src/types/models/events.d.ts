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
		invitedBy?: SocialData
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullInvitee {
		user: SocialData
		attendingStatus: "Not Attending" | "Not Responded"
		invitedBy: SocialData
	}

	interface EventfullAttendee {
		user: SocialData
		invitedBy?: SocialData
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullCoHost {
		user: SocialData
		invitedBy: SocialData
	}

	interface BaseEventfullEvent {
		eventName: string
		eventTimeStart: UnifiedDateTime
		eventTimeEnd: UnifiedDateTime
		eventPrice: number
		eventType: string
		isVirtual: boolean
		organizer: SocialData
		isActive: boolean
		eventPublic: boolean
		eventReviewable: boolean
		canInvitedUsersInviteOthers: boolean
		eventURL?: string
		extraEventCategories?: string[]
		eventDescription?: string
		eventLocation?: {
			address: string
		}
		eventImageURL?: string
	}

	interface EventfullEvent extends BaseEventfullEvent, IDInterface {
		invitees: EventfullInvitee[]
		coHosts: EventfullCoHost[]
		attendees: EventfullAttendee[]
		eventCapacity: number | null
	}

	interface IncomingEventfullEvent extends BaseEventfullEvent {
		invitees: SocialData[]
		coHosts: SocialData[]
		eventCapacity?: number
	}
}

export {}
