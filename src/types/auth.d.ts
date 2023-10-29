declare global {
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
