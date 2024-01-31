import { Schema, model } from "mongoose"
import socialDataSchema, { socialDataWithTimestampSchema } from "./chat/social-data-model"

const eventfullInviteesSchema = new Schema<EventfullInvitee>({
	user: { type: socialDataSchema, required: true },
	attendingStatus: { type: String, required: true, enum: ["Not Attending", "Not Responded"] },
	invitedBy: { type: socialDataWithTimestampSchema, required: true },
}, { _id: false, timestamps: true })

const eventfullAttendeesSchema = new Schema<EventfullAttendee>({
	user: { type: socialDataSchema, required: true },
	invitedBy: { type: socialDataWithTimestampSchema },
	reviewRating: { type: Number },
	reviewText: { type: String },
}, { _id: false, timestamps: true })

const eventfullCoHostSchema = new Schema<EventfullCoHost>({
	user: { type: socialDataSchema, required: true },
	invitedBy: { type: socialDataWithTimestampSchema, required: true },
}, { _id: false, timestamps: true })

const createdBySchema = new Schema<CreatedBy>({
	userId: { type: Schema.Types.ObjectId, ref: "Admin" },
	username: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	isCreatedByAdmin: { type: Boolean, default: false },
}, { _id: false })

const baseEventTimeSchema = new Schema<BaseEventTime>({
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	eventDuration: {
		hours: { type: Number, required: true },
		minutes: { type: Number, required: true },
	},
}, { _id: false })

const ongoingEventTimeSchema = new Schema<OngoingEvents>({
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	eventDuration: {
		hours: { type: Number, required: true },
		minutes: { type: Number, required: true },
	},
	dayOfWeek: { type: String, enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
}, { _id: false })

const eventfullEventSchema = new Schema<EventfullEvent>({
	eventName: { type: String, required: true },
	eventPrice: { type: Number, required: true },
	eventType: { type: String, required: true },
	isVirtual: { type: Boolean, required: true },
	isActive: { type: Boolean, required: true },
	eventPublic: { type: Boolean, required: true },
	eventReviewable: { type: Boolean, required: true },
	canInvitedUsersInviteOthers: { type: Boolean, required: true },
	eventFrequency: { type: String, enum: ["one-time", "custom", "ongoing"], required: true },
	address: { type: String, required: true },
	eventDescription: { type: String, required: true },

	invitees: { type: [eventfullInviteesSchema], required: true},
	attendees: { type: [eventfullAttendeesSchema], required: true},
	coHosts: { type: [eventfullCoHostSchema], required: true },

	singularEventTime: { type: baseEventTimeSchema },
	customEventDates: { type: [baseEventTimeSchema] },
	ongoingEventTimes: { type: [ongoingEventTimeSchema] },

	eventCapacity: { type: Number, default: null },

	organizer: { type: socialDataSchema },
	eventURL: { type: String },
	extraEventCategories: {type: [String]},
	eventImageURL: { type: String },
	createdBy: { type: createdBySchema },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventfullEventModel = model("EventfullEvent", eventfullEventSchema, "eventfull-events")

export default EventfullEventModel
