import mongoose, { Schema } from "mongoose"

const eventCategorySchema = new Schema<EventCategory>({
	eventCategory: { type: String, required: true },
	description: { type: String, required: true },
})

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EventCategoryModel = mongoose.model("EventCategory", eventCategorySchema, "event-categories")

const eventTypeSchema = new Schema<EventType>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	categories: { type: [String], required: true },
})

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EventTypeModel = mongoose.model("EventType", eventTypeSchema, "event-types")
