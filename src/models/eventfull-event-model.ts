import { Schema, model } from "mongoose"
import { unifiedDateTimeSchema } from "./calendar-data-model"

const eventfullInviteesSchema = new Schema<EventfullInvitee>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	attendingStatus: { type: String, required: true, enum: ["Attending", "Not Attending", "Not Responded"] },
	invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	reviewRating: { type: Number },
	reviewText: { type: String },
})

const eventfullEventSchema = new Schema<EventfullEvent>({
	eventName: { type: String, required: true },
	eventTimeStart: { type: unifiedDateTimeSchema, required: true },
	eventTimeEnd: { type: unifiedDateTimeSchema, required: true },
	eventPrice: { type: Number, required: true },
	eventType: { type: String, required: true },
	isVirtual: { type: Boolean, required: true },
	eventPublic: { type: Boolean, required: true },
	organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	coHosts: { type: [Schema.Types.ObjectId], ref: "User", required: true },
	isActive: { type: Boolean, required: true },
	eventReviewable: { type: Boolean, required: true },
	canInvitedUsersInviteOthers: { type: Boolean, required: true },
	invitees: { type: [eventfullInviteesSchema], required: true},
	eventURL: { type: String },
	eventDescription: { type: String },
	extraEventCategories: {type: [String]},
	eventLocation: {
		address: String,
	},
	eventImageURL: { type: String },
	eventCapacity: { type: Number },
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventfullEventModel = model("EventfullEvent", eventfullEventSchema, "eventfull-events")

export default EventfullEventModel