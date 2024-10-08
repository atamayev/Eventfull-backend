declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string

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

		// SendGrid Auth
		SENDGRID_API_KEY: string
		SENDGRID_FROM_EMAIL: string

		// AWS Auth
		AWS_ACCESS_KEY_ID: string
		AWS_SECRET_ACCESS_KEY: string
		AWS_REGION: string

		// AWS SNS
		AWS_FCM_ARN: string
		AWS_APNS_ARN: string
	}
}
