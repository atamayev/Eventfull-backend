declare global {
	interface AdminLoginInformation {
		contact: string
		password: string
	}

	interface AdminLoginOTPInformation {
		email: string
		otp: string
	}

	interface InitialAdminRegisterInformation {
		email: string
		firstName: string
		lastName: string
	}

	interface SecondaryAdminRegisterInformation {
		username: string
		password: string
	}
}

export {}
