declare global {
	interface ChangePasswordObject {
		currentPassword: string
		newPassword: string
		newConfirmPassword: string
	}

	interface LoginInformationObject {
		email: string
		password: string
	}

	type UserIdAndPassword = {
		userId: string
		password: string
	}
}

export {}
