import { Schema } from "mongoose"

const calendarDataSchema = new Schema<UnifiedCalendarEvent>({
	id: { type: String, required: true, unique: true },
	title: { type: String, required: true },
	description: { type: String, required: false },
	startDateTime: { type: String, required: true },
	endDateTime: { type: String, required: true },
	timeZone: { type: String, required: false },
	location: { type: String, required: false },
	organizerEmail: { type: String, required: false },
	attendees: [{
		email: { type: String, required: true },
		responseStatus: { type: String, required: false }
	}],
	isAllDay: { type: Boolean, required: true },
	recurrence: {
		pattern: { type: String, required: false },
		interval: { type: Number, required: false }
	},
	source: { type: String, required: true, enum: ["google", "microsoft", "local"] },
	link: { type: String, required: false }
})

export default calendarDataSchema
