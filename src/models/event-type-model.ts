import { Schema, model } from "mongoose"
import { adminData } from "./chat/social-data-model"

const eventCategoriesSchema = new Schema<EventCategoryInsideEventType>({
	categoryId: { type: Schema.Types.ObjectId, ref: "EventCategory" },
	eventCategoryName: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true, _id: false })

const eventTypeSchema = new Schema<EventType>({
	eventTypeName: { type: String, required: true, unique: true, trim: true },
	description: { type: String, required: true, trim: true },
	categories: { type: [eventCategoriesSchema], required: true },
	isActive: { type: Boolean, required: true, default: true },
	createdBy: { type: adminData, required: true },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventTypeModel = model("EventType", eventTypeSchema, "event-types")

export default EventTypeModel
