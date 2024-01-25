import { Types } from "mongoose"

declare global {
	interface User extends IDInterface, TimestampsInterface {
		firstName: string
		authMethod: AuthSources
		primaryContactMethod: EmailOrPhone
		primaryDevicePlatform: DevicePlatforms
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
		friends: SocialData[]
		outgoingFriendRequests: SocialData[]
		incomingFriendRequests: SocialData[]
		blockedUsers: SocialData[]
		blockedByUsers: SocialData[]
		privateChats: PrivateChats[]
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

	interface LoginHistory extends IDInterface {
		loginTime: Date
		// ipAddress: string
		// device: string
	}

	interface PrivateChats extends IDInterface {
		privateChatId: Types.ObjectId
		chatName: string
	}

	interface GroupChats extends IDInterface {
		groupChatId: Types.ObjectId
		chatName: string
	}
}

export {}
