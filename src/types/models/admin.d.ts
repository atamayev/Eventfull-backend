declare global {
	interface Admin extends IDInterface, TimestampsInterface {
		firstName: string
		lastName: string
		email: string
		username: string
		password: string
		loginHistory: LoginHistory[]
	}
}

export {}
