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
		firstName: string
		lastName: string
		authMethod: AuthSources
		primaryContactMethod: EmailOrPhone
		primaryDevicePlatform: DevicePlatforms
		createdAt: Date
		updatedAt: Date
		notificationToken?: string
		email?: string
		phoneNumber?: string
		username?: string
		password?: string
		gender?: string
		profilePictureURL?: string
		bio?: string
		eventPins: Types.ObjectId[]
		calendarData: UnifiedCalendarEvent[]
		eventfullEvents: EventfullCalendarEvent[]
		colorTheme: "Light" | "Dark" | "System Default"
		iosEndpointArn?: string
		androidEndpointArn?: string

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
		directMessageChats: Types.ObjectId[]
		groupMessageChats: Types.ObjectId[]

		isPhoneVerified?: boolean
		phoneVerificationCode?: string
		phoneVerificationCodeTimestamp?: Date
		phoneVerifiedTimestamp?: Date

		isEmailVerified?: boolean
		emailVerificationCode?: string
		emailVerificationCodeTimestamp?: Date
		emailVerifiedTimestamp?: Date
	}

	interface LoginHistory {
		loginTime: Date
		// ipAddress: string
		// device: string
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

	interface Chat extends IDInterface {
		participants: Types.ObjectId[]
		createdAt: Date
		updatedAt: Date
		isActive: boolean
		lastMessage: MessageWithChatId | null
	}

	interface Message extends IDInterface {
		senderId: Types.ObjectId
		text: string
		createdAt: Date
		updatedAt: Date
	}

	interface MessageWithChatId extends Message {
		chatId: Types.ObjectId
	}
}

export {}
