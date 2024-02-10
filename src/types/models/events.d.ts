import { Types } from "mongoose"

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
		eventCategoryName: string
		description: string
		isActive: boolean
		createdBy: AdminSocialData
	}

	interface EventCategoryInsideEventType extends TimestampsInterface {
		categoryId: Types.ObjectId
		eventCategoryName: string
		description: string
	}

	interface EventTypeInsideEvent {
		eventTypeId: Types.ObjectId
	}

	interface EventType extends IDInterface, TimestampsInterface {
		eventTypeName: string
		description: string
		categories: EventCategoryInsideEventType[]
		isActive: boolean
		createdBy: AdminSocialData
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

	interface EventImages {
		imageId: string
		isActive: boolean
		imageURL?: string
	}

	interface ExtraEventCategories {
		categoryId: Types.ObjectId
	}

	interface BaseEventfullEvent {
		eventName: string
		eventPrice: number
		eventType: Types.ObjectId
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
		extraEventCategories?: ExtraEventCategories[]
		eventImages: EventImages[]

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

	interface OutgoingEventfullEvent extends Omit<BaseEventfullEvent, "eventType"> {
		_id: Types.ObjectId
		eventType: {
			eventTypeId: Types.ObjectId
			eventTypeName: string
		}
		invitees: EventfullInvitee[]
		coHosts: EventfullCoHost[]
		attendees: EventfullAttendee[]
		eventCapacity: number | null
		createdBy?: CreatedBy
	}

	interface IncomingEventCategory {
		eventCategoryName: string
		description: string
	}

	interface IncomingEventType {
		eventTypeName: string
		description: string
		categories: EventCategoryInsideEventType[]
	}
}

export {}
