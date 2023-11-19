import { Types } from "mongoose"

declare global {
	interface ChangePasswordObject {
		email: string
		currentPassword: string
		newPassword: string
	}

	interface LoginInformationObject {
		email: string
		password: string
	}

	type UserIdAndPassword = {
		userId: Types.ObjectId
		password: string
	}
}

export {}
