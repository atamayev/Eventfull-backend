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

			// Microsoft Auth:
			MICROSOFT_CLIENT_ID: string
			MICROSOFT_SECRET_ID: string
			MICROSOFT_TENANT_ID: string

			PORT: string
		}
	}
}

export {}
