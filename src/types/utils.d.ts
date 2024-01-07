import { Document, Types } from "mongoose"

declare global {
	interface IDInterface extends Document {
		_id: Types.ObjectId
	}

	interface JwtPayload {
		userId: string
		newUser: boolean
	}

	type EmailOrPhone = "Email" | "Phone"

	type EmailOrPhoneOrUnknown = EmailOrPhone | "Unknown"

	type EmailOrPhoneOrUsername = EmailOrPhone | "Username"

	type AcceptOrDecline = "Accept" | "Decline"

	type AttendingStatuses = "Attending" | "Not Attending" | "Not Responded" | "Hosting" | "Co-Hosting"

	type CloudAuthSources = "Google" | "Microsoft"
	type AuthSources = "Local" | CloudAuthSources

	type DevicePlatforms = "ios" | "android" | "windows" | "macos" | "web"

	type UserConnectionInfo = {
		socketId: string
		status: AppStates
	}

	type AppStates = "active" | "inactive" | "background"

	interface ChatNameMapping {
		[key: string]: string
	}

	interface TimestampsInterface {
		createdAt: Date
		updatedAt: Date
	}
}

export {}
