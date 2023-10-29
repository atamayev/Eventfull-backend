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

const userSchema = new Schema<User>({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	gender: { type: String },
	createdAt: { type: String },
	updatedAt: { type: String },
	profilePictureURL: { type: String },
	phoneNumber: { type: String },
	bio: { type: String },
	eventPins: { type: [Types.ObjectId] },
	calendarData: { type: [calendarDataSchema] }
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserModel = model("User", userSchema, "users")
