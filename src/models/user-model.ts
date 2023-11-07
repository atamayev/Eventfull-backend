import { Schema, Types, model } from "mongoose"
import calendarDataSchema from "./calendar-data-model"

const loginHistorySchema = new Schema({
	loginTime: { type: Date, default: Date.now },
	// ipAddress: { type: String },
	// device: { type: String }
})

const userSchema = new Schema<User>({
	email: { type: String, required: true, unique: true },
	authMethod: { type: String, required: true },
	password: { type: String},
	firstName: { type: String },
	lastName: { type: String },
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
	microsoftLoginAccessToken: { type: String },
	microsoftLoginRefreshToken: { type: String },
	microsoftLoginAccessTokenExpiryDate: { type: Date },
	microsoftCalendarAccessToken: { type: String },
	microsoftCalendarAccessTokenExpiryDate: { type: Date },
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
