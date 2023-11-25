import { Schema, Types, model } from "mongoose"
import calendarDataSchema from "./calendar-data-model"

const loginHistorySchema = new Schema({
	loginTime: { type: Date, default: Date.now },
	// ipAddress: { type: String },
	// device: { type: String }
})

const userSchema = new Schema<User>({
	email: { type: String, unique: true, trim: true },
	authMethod: { type: String, required: true, trim: true, enum: ["local", "microsoft", "google"] },
	phone: { type: String, unique: true, trim: true },
	username: { type: String, trim: true, unique: true },
	password: { type: String },
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	gender: { type: String, trim: true },
	profilePictureURL: { type: String, trim: true },
	phoneNumber: { type: String, trim: true },
	bio: { type: String, trim: true },
	eventPins: { type: [Types.ObjectId] },
	calendarData: { type: [calendarDataSchema] },

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

	loginHistory: { type: [loginHistorySchema] },
	friends: [{ type: Types.ObjectId, ref: "User" }],
	outgoingFriendRequests: [{ type: Types.ObjectId, ref: "User" }],
	incomingFriendRequests: [{ type: Types.ObjectId, ref: "User" }],
	blockedUsers: [{ type: Types.ObjectId, ref: "User" }],
	blockedByUsers: [{ type: Types.ObjectId, ref: "User" }],
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const UserModel = model("User", userSchema, "users")

export default UserModel
