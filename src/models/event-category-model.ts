import { Schema, model } from "mongoose"
import { adminData } from "./chat/social-data-model"

const eventCategorySchema = new Schema<EventCategory>({
	eventCategoryName: { type: String, required: true, unique: true, trim: true },
	description: { type: String, required: true, trim: true },
	isActive: { type: Boolean, required: true, default: true },
	createdBy: { type: adminData, required: true },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventCategoryModel = model("EventCategory", eventCategorySchema, "event-categories")

export default EventCategoryModel
