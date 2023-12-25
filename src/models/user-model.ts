import { Schema, model } from "mongoose"
import calendarDataSchema from "./calendar-data-model"

const loginHistorySchema = new Schema<LoginHistory>({
	loginTime: { type: Date, default: Date.now },
	// ipAddress: { type: String },
	// device: { type: String }
})

const eventfullEventsSchema = new Schema<EventfullCalendarEvent>({
	eventId: { type: Schema.Types.ObjectId, ref: "EventfullEvent", required: true },
	attendingStatus: { type: String, required: true, enum: ["Attending", "Not Attending", "Not Responded", "Hosting", "Co-Hosting"] },
	invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
	reviewRating: { type: Number },
	reviewText: { type: String },
})

const userSchema = new Schema<User>({
	email: { type: String, unique: true, sparse: true, trim: true },
	authMethod: { type: String, required: true, trim: true, enum: ["Local", "Microsoft", "Google"] },
	phoneNumber: { type: String, unique: true, sparse: true, trim: true },
	primaryContactMethod: { type: String, trim: true, enum: ["Email", "Phone"] },
	username: { type: String, trim: true, unique: true },
	password: { type: String },
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	gender: { type: String, trim: true },
	profilePictureURL: { type: String, trim: true },
	bio: { type: String, trim: true },
	eventPins: { type: [Schema.Types.ObjectId] },
	calendarData: { type: [calendarDataSchema] },
	eventfullEvents: { type: [eventfullEventsSchema] },
	colorTheme: { type: String, default: "System Default", enum: ["Dark", "Light", "System Default"] },

	googleLoginAccessToken: { type: String, trim: true },
	googleLoginRefreshToken: { type: String, trim: true },
	googleLoginAccessTokenExpiryDate: { type: Date, trim: true },

	googleCalendarAccessToken: { type: String, trim: true },
	googleCalendarAccessTokenExpiryDate: { type: Date, trim: true },
	googleCalendarRefreshToken: { type: String, trim: true },

	microsoftLoginAccessToken: { type: String, trim: true },
	microsoftLoginRefreshToken: { type: String, trim: true },
	microsoftLoginAccessTokenExpiryDate: { type: Date, trim: true },

	microsoftCalendarAccessToken: { type: String, trim: true },
	microsoftCalendarRefreshToken: { type: String, trim: true },
	microsoftCalendarAccessTokenExpiryDate: { type: Date, trim: true },
	microsoftDefaultCalendarId: { type: String, trim: true },

	isPhoneVerified: { type: Boolean },
	phoneVerificationCode: { type: String },
	phoneVerificationCodeTimestamp: { type: Date },
	phoneVerifiedTimestamp: { type: Date },

	isEmailVerified: { type: Boolean },
	emailVerificationCode: { type: String },
	emailVerificationCodeTimestamp: { type: Date },
	emailVerifiedTimestamp: { type: Date },

	loginHistory: { type: [loginHistorySchema], required: true },
	friends: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true
	},
	outgoingFriendRequests: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true
	},
	incomingFriendRequests: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true
	},
	blockedUsers: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true
	},
	blockedByUsers: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true
	}
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const UserModel = model("User", userSchema, "users")

export default UserModel
