import { Schema, model } from "mongoose"
import socialDataSchema from "./chat/social-data-model"
import { unifiedDateTimeSchema } from "./calendar-data-model"

const eventfullInviteesSchema = new Schema<EventfullInvitee>({
	user: { type: socialDataSchema, required: true },
	attendingStatus: { type: String, required: true, enum: ["Not Attending", "Not Responded"] },
	invitedBy: { type: socialDataSchema, required: true },
}, { _id: false, timestamps: true })

const eventfullAttendeesSchema = new Schema<EventfullAttendee>({
	user: { type: socialDataSchema, required: true },
	invitedBy: { type: socialDataSchema },
	reviewRating: { type: Number },
	reviewText: { type: String },
}, { _id: false, timestamps: true })

const eventfullCoHostSchema = new Schema<EventfullCoHost>({
	user: { type: socialDataSchema, required: true },
	invitedBy: { type: socialDataSchema, required: true },
}, { _id: false, timestamps: true })

const eventfullEventSchema = new Schema<EventfullEvent>({
	eventName: { type: String, required: true },
	eventTimeStart: { type: unifiedDateTimeSchema, required: true },
	eventTimeEnd: { type: unifiedDateTimeSchema, required: true },
	eventPrice: { type: Number, required: true },
	eventType: { type: String, required: true },
	isVirtual: { type: Boolean, required: true },
	eventPublic: { type: Boolean, required: true },
	organizer: { type: socialDataSchema, required: true },
	coHosts: { type: [eventfullCoHostSchema], required: true },
	isActive: { type: Boolean, required: true },
	eventReviewable: { type: Boolean, required: true },
	canInvitedUsersInviteOthers: { type: Boolean, required: true },
	invitees: { type: [eventfullInviteesSchema], required: true},
	attendees: { type: [eventfullAttendeesSchema], required: true},
	eventCapacity: { type: Number, default: null },

	eventURL: { type: String },
	eventDescription: { type: String },
	extraEventCategories: {type: [String]},
	eventLocation: { address: String },
	eventImageURL: { type: String },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventfullEventModel = model("EventfullEvent", eventfullEventSchema, "eventfull-events")

export default EventfullEventModel
