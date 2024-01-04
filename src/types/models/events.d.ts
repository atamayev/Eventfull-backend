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

	interface EventfullCalendarEvent extends IDInterface {
		eventId: Types.ObjectId
		attendingStatus: AttendingStatuses
		invitedBy?: Types.ObjectId
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullInvitee {
		userId: Types.ObjectId
		attendingStatus: "Not Attending" | "Not Responded"
		invitedBy: Types.ObjectId
	}

	interface EventfullAttendee {
		userId: Types.ObjectId
		invitedBy?: Types.ObjectId
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullCoHost {
		userId: Types.ObjectId
		invitedBy: Types.ObjectId
	}

	interface BaseEventfullEvent {
		eventName: string
		eventTimeStart: UnifiedDateTime
		eventTimeEnd: UnifiedDateTime
		eventPrice: number
		eventType: string
		isVirtual: boolean
		organizerId: Types.ObjectId
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
		invitees: Types.ObjectId[]
		coHosts: Types.ObjectId[]
		eventCapacity?: number
	}
}

export {}
