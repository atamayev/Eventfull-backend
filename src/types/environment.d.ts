declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Hash:
			SALT_ROUNDS: string

			// JWT:
			JWT_KEY: string

			// MongoDB:
			MONGODB_URI: string

			// Google Auth:
			GOOGLE_CLIENT_ID: string
			GOOGLE_CLIENT_SECRET: string

			PORT: string
		}
	}
}

export {}
