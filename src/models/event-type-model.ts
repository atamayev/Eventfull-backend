import { Schema, model } from "mongoose"
import trimArray from "../utils/trim-array"

const eventTypeSchema = new Schema<EventType>({
	name: { type: String, required: true, unique: true, trim: true },
	description: { type: String, required: true, trim: true },
	categories: { type: [String], required: true, set: trimArray }
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventTypeModel = model("EventType", eventTypeSchema, "event-types")

export default EventTypeModel
