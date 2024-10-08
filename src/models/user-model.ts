import { Schema, model } from "mongoose"
import calendarDataSchema from "./calendar-data-model"
import { socialDataWithTimestampSchema } from "./chat/social-data-model"

const loginHistorySchema = new Schema<LoginHistory>({
	loginTime: { type: Date, default: Date.now },
	// ipAddress: { type: String },
	// device: { type: String }
})

const privateMessagesSchema = new Schema<PrivateChats>({
	privateChatId: { type: Schema.Types.ObjectId, ref: "PrivateChat", required: true },
	chatName: { type: String, required: true }
})

const groupChatsSchema = new Schema<GroupChats>({
	groupChatId: { type: Schema.Types.ObjectId, ref: "GroupChat", required: true },
	chatName: { type: String, required: true }
})

const eventfullEventsSchema = new Schema<EventfullCalendarEvent>({
	eventId: { type: Schema.Types.ObjectId, ref: "EventfullEvent", required: true },
	attendingStatus: { type: String, required: true, enum: ["Attending", "Not Attending", "Not Responded", "Hosting", "Co-Hosting"] },
	invitedBy: { type: socialDataWithTimestampSchema },
	reviewRating: { type: Number },
	reviewText: { type: String },
}, { _id: false, timestamps: true })

const userSchema = new Schema<User>({
	firstName: { type: String, trim: true, required: true },
	lastName: { type: String, trim: true },
	authMethod: { type: String, required: true, trim: true, enum: ["Local", "Microsoft", "Google"] },
	primaryContactMethod: { type: String, required: true, trim: true, enum: ["Email", "Phone"] },
	primaryDevicePlatform: { type: String, required: true, trim: true, enum: ["ios", "android", "windows", "macos", "web"] },
	notificationToken: { type: String, trim: true },
	email: { type: String, unique: true, sparse: true, trim: true },
	phoneNumber: { type: String, unique: true, sparse: true, trim: true },
	username: { type: String, trim: true, unique: true },
	password: { type: String },
	gender: { type: String, trim: true },
	profilePictureURL: { type: String, trim: true },
	bio: { type: String, trim: true },

	eventPins: { type: [Schema.Types.ObjectId] },
	calendarData: { type: [calendarDataSchema] },
	eventfullEvents: { type: [eventfullEventsSchema] },
	onlyShowEventfullEvents: { type: Boolean, default: false },

	colorTheme: { type: String, default: "System Default", enum: ["Dark", "Light", "System Default"] },
	androidEndpointArn: { type: String, trim: true },
	iosEndpointArn: { type: String, trim: true },

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
	friends: { type: [socialDataWithTimestampSchema], required: true },
	outgoingFriendRequests: { type: [socialDataWithTimestampSchema], required: true },
	incomingFriendRequests: { type: [socialDataWithTimestampSchema], required: true },
	blockedUsers: { type: [socialDataWithTimestampSchema], required: true },
	blockedByUsers: { type: [socialDataWithTimestampSchema], required: true },
	privateChats: { type: [privateMessagesSchema],	required: true },
	groupChats: { type: [groupChatsSchema], required: true}
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const UserModel = model("User", userSchema, "users")

export default UserModel
