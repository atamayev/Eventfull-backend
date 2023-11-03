import { Schema, model } from "mongoose"

const eventSchema = new Schema<Event>({
	eventName: { type: String, required: true },
	eventTimeStart: { type: Date, required: true },
	eventTimeEnd: { type: Date, required: true },
	eventPrice: { type: Number, required: true },
	eventType: { type: String, required: true },
	eventURL: { type: String, required: true },
	isVirtual: { type: Boolean, required: true },
	extraEventCategories: [String],
	eventDescription: String,
	eventLocation: {
		longitude: String,
		latitude: String,
		address: String,
	},
	organizerName: String,
	eventImageURL: String,
	eventCapacity: Number,
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventModel = model("Event", eventSchema, "events")

export default EventModel
