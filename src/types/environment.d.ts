declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string

			// Hash:
			SALT_ROUNDS: string

			// JWT:
			JWT_KEY: string

			// MongoDB:
			MONGODB_URI: string

			// Frontend:
			FRONTEND_URL: string

			// Google Auth:
			GOOGLE_CLIENT_ID: string
			GOOGLE_CLIENT_SECRET: string

			// Microsoft Auth:
			MICROSOFT_CLIENT_ID: string
			MICROSOFT_SECRET_ID: string
			MICROSOFT_TENANT_ID: string

			// Twilio Auth
			TWILIO_ACCOUNT_SID: string
			TWILIO_AUTH_TOKEN: string
			TWILIO_PHONE_NUMBER: string

			// SendGrid Auth
			SENDGRID_API_KEY: string
			SENDGRID_FROM_EMAIL: string
		}
	}
}

export {}
