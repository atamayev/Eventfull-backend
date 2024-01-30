declare global {
	interface AdminLoginInformation {
		contact: string
		password: string
	}

	interface AdminRegisterInformation {
		firstName: string
		lastName: string
		email: string
		username: string
		password: string
	}
}

export {}
