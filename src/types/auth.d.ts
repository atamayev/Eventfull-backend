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
	}

	interface CloudUserRegisterInformationObject {
		firstName: string
		lastName: string
		username: string
	}

	interface RegisterInformationObject {
		contact: string
		firstName: string
		lastName: string
		username: string
		password: string
	}

	interface NewLocalUserFields {
		firstName: string
		lastName: string
		username: string
		password: string
		authMethod: "Local"
		primaryContactMethod: EmailOrPhone
		email?: string
		phoneNumber?: string
		isEmailVerified?: boolean
		isPhoneVerified?: boolean
	}

	type UserIdAndPassword = {
		userId: Types.ObjectId
		password: string
	}
}

export {}
