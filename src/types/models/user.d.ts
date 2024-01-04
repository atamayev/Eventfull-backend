import { Types } from "mongoose"

declare global {
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
		directMessageChats: DirectMessages[]
		groupMessageChats: GroupMessages[]

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

	interface DirectMessages {
		directMessageChatId: Types.ObjectId
		chatName: string
	}

	interface GroupMessages {
		groupMessageChatId: Types.ObjectId
		chatName: string
	}
}

export {}
