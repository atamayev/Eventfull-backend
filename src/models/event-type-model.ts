import { Schema, model } from "mongoose"

const eventTypeSchema = new Schema<EventType>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	categories: { type: [String], required: true }
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EventTypeModel = model("EventType", eventTypeSchema, "event-types")
