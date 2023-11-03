import { Schema, Types, model } from "mongoose"

const calendarDataSchema = new Schema<CalendarData>({
	eventName: { type: String, required: true },
	start: {
		dateTime: { type: String, required: true },
		timeZone: { type: String, required: true },
	},
	end: {
		dateTime: { type: String, required: true },
		timeZone: { type: String, required: true },
	}
})

const loginHistorySchema = new Schema({
	loginTime: { type: Date, default: Date.now },
	// ipAddress: { type: String },
	// device: { type: String }
})

const userSchema = new Schema<User>({
	email: { type: String, required: true, unique: true },
	authMethod: { type: String, required: true },
	password: { type: String},
	name: { type: String },
	gender: { type: String },
	profilePictureURL: { type: String },
	phoneNumber: { type: String },
	bio: { type: String },
	eventPins: { type: [Types.ObjectId] },
	calendarData: { type: [calendarDataSchema] },
	googleLoginAccessToken: { type: String },
	googleLoginRefreshToken: { type: String },
	googleLoginAccessTokenExpiryDate: { type: Date },
	googleCalendarAccessToken: { type: String },
	googleCalendarAccessTokenExpiryDate: { type: Date },
	loginHistory: { type: [loginHistorySchema] }
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserModel = model("User", userSchema, "users")
