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
}

export {}
