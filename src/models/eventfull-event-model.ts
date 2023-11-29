import { Schema, model } from "mongoose"
import { unifiedDateTimeSchema } from "./calendar-data-model"

const eventfullEventSchema = new Schema<EventfullEvent>({
	eventName: { type: String, required: true },
	eventTimeStart: { type: unifiedDateTimeSchema, required: true },
	eventTimeEnd: { type: unifiedDateTimeSchema, required: true },
	eventPrice: { type: Number, required: true },
	eventType: { type: String, required: true },
	isVirtual: { type: Boolean, required: true },
	eventPublic: { type: Boolean, required: true },
	organizerId: { type: Schema.Types.ObjectId, required: true },
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
