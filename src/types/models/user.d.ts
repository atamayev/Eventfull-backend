import { Types } from "mongoose"

declare global {
	interface User extends IDInterface {
		firstName: string
		authMethod: AuthSources
		primaryContactMethod: EmailOrPhone
		primaryDevicePlatform: DevicePlatforms
		createdAt: Date
		updatedAt: Date
		lastName?: string
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
		directMessageChats: DirectMessageChats[]
		groupChats: GroupChats[]

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

	interface DirectMessageChats {
		directMessageChatId: Types.ObjectId
		chatName: string
	}

	interface GroupChats {
		groupChatId: Types.ObjectId
		chatName: string
	}
}

export {}
