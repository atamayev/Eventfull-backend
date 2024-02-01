declare global {
	interface Admin extends IDInterface, TimestampsInterface {
		firstName: string
		lastName: string
		email: string
		loginHistory: LoginHistory[]

		username?: string
		password?: string

		emailVerificationCode?: string
		emailVerifiedTimestamp?: Date
	}
}

export {}
