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
		eventPins?: Types.ObjectId[]
		calendarData: UnifiedCalendarEvent[]

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

	interface EventfullEvent extends IDInterface {
		eventName: string
		eventTimeStart: UnifiedDateTime
		eventTimeEnd: UnifiedDateTime
		eventPrice: number
		eventType: string
		isVirtual: boolean
		organizerId: Types.ObjectId
		eventPublic: boolean
		canInvitedUsersInviteOthers?: boolean
		eventAttendees?: Types.ObjectId[]
		invitees?: Types.ObjectId[]
		eventURL?: string
		// Categories should be of type eventCategory[]
		extraEventCategories?: string[]
		eventDescription?: string
		eventLocation?: {
			address: string
		}
		eventImageURL?: string
		eventCapacity?: number
	}

	interface Booking extends IDInterface {
		userId: Types.ObjectId
		eventId: Types.ObjectId
		reviewRating?: number
		reviewMessage?: string
	}
}

export {}
