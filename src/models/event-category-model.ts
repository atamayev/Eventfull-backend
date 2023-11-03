import { Schema, model } from "mongoose"

const eventCategorySchema = new Schema<EventCategory>({
	eventCategory: { type: String, required: true },
	description: { type: String, required: true }
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventCategoryModel = model("EventCategory", eventCategorySchema, "event-categories")

export default EventCategoryModel
