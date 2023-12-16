import { Types } from "mongoose"

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

	interface User extends IDInterface {
		authMethod: "local" | "google" | "microsoft"
		primaryContactMethod: EmailOrPhone
		email?: string
		phone?: string
		username?: string
		password?: string
		createdAt: Date
		updatedAt: Date
		firstName?: string
		lastName?: string
		gender?: string
		profilePictureURL?: string
		phoneNumber?: string
		bio?: string
		eventPins: Types.ObjectId[]
		calendarData: UnifiedCalendarEvent[]
		eventfullEvents: EventfullCalendarEvent[]

		googleLoginAccessToken?: string
		googleLoginRefreshToken?: string
		googleLoginAccessTokenExpiryDate?: Date
		googleCalendarAccessToken?: string
		googleCalendarAccessTokenExpiryDate?: Date
		googleCalendarRefreshToken?: string

        microsoftLoginAccessToken?: string
        microsoftLoginRefreshToken?: string
        microsoftLoginAccessTokenExpiryDate?: Date
		microsoftCalendarAccessToken?: string
		microsoftCalendarRefreshToken?: string
		microsoftCalendarAccessTokenExpiryDate?: Date
		microsoftDefaultCalendarId?: string

		loginHistory: LoginHistory[]
		friends: Types.ObjectId[]
		outgoingFriendRequests: Types.ObjectId[]
		incomingFriendRequests: Types.ObjectId[]
		blockedUsers: Types.ObjectId[]
		blockedByUsers: Types.ObjectId[]
	}

	interface LoginHistory {
		loginTime: Date
		// ipAddress: string
		// device: string
	}

	interface EventfullCalendarEvent extends IDInterface {
		eventId: Types.ObjectId
		isAttending: AttendingStatuses
		invitedBy: Types.ObjectId
		reviewRating?: number
		reviewText?: string
	}

	interface EventfullInvitee {
		userId: Types.ObjectId
		isAttending: AttendingStatuses
		invitedBy: Types.ObjectId
		reviewRating?: number
		reviewText?: string
	}

	interface BaseEventfullEvent {
		eventName: string
		eventTimeStart: UnifiedDateTime
		eventTimeEnd: UnifiedDateTime
		eventPrice: number
		eventType: string
		isVirtual: boolean
		organizerId: Types.ObjectId
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
		eventCapacity?: number
	}

	interface EventfullEvent extends BaseEventfullEvent {
		invitees?: EventfullInvitee[]
	}

	interface IncomingEventfullEvent extends BaseEventfullEvent {
		invitees?: Types.ObjectId[]
	}
}

export {}
