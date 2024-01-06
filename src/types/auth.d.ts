import { Types } from "mongoose"

declare global {
	interface ChangePasswordObject {
		contact: string
		currentPassword: string
		newPassword: string
	}

	interface LoginInformationObject {
		contact: string
		password: string
		notificationToken: string
		primaryDevicePlatform: DevicePlatforms
	}

	interface GoogleLoginInformationObject {
		idToken: string
		code: string
		notificationToken: string
		primaryDevicePlatform: DevicePlatforms
	}

	interface CloudUserRegisterInformationObject {
		firstName: string
		lastName: string
		username: string
	}

	interface RegisterInformationObject extends LoginInformationObject, CloudUserRegisterInformationObject {
		contactType: EmailOrPhone
	}

	interface NewUserFields {
		firstName: string
		lastName: string
		notificationToken: string
		primaryDevicePlatform: DevicePlatforms
		iosEndpointArn?: string
		androidEndpointArn?: string
	}

	interface NewLocalUserFields extends NewUserFields {
		username: string
		password: string
		authMethod: "Local"
		primaryContactMethod: EmailOrPhone
		email?: string
		phoneNumber?: string
		isEmailVerified?: false
		isPhoneVerified?: false
	}

	interface NewCloudUserFields extends NewUserFields {
		authMethod: CloudAuthSources
		primaryContactMethod: "Email"
		email: string
		isEmailVerified: true
	}

	type UserIdAndPassword = {
		userId: Types.ObjectId
		password: string
	}

	type LoginSocialData = {
		_id: string
		username: string
	}

	type LoginSocialDataFields = {
		friends: LoginSocialData[]
		incomingFriendRequests: LoginSocialData[]
		outgoingFriendRequests: LoginSocialData[]
		blockedUsers: LoginSocialData[]
		groupChats: GroupChatWithNames[]
		privateChats: PrivateChatWithNames[]
	}

	type GoogleLoginTokensResponse = {
		googleUser: User
		isNewUser: boolean
	}
}

export {}
