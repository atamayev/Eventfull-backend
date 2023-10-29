declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Hash:
			SALT_ROUNDS: string

			// JWT:
			JWT_KEY: string

			PORT: string

		}
	}
}

export {}
