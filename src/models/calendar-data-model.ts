import { Schema } from "mongoose"

const unifiedDateTimeSchema = new Schema({
	date: { type: String, required: true },
	time: { type: String, required: true }
})

const unifiedCalendarAttendeeSchema = new Schema({
	email: { type: String, required: true },
	responseStatus: { type: String, required: false }
})

const recurrenceSchema = new Schema({
	pattern: { type: String, required: true },
	interval: { type: Number, required: true }
})

const calendarDataSchema = new Schema<UnifiedCalendarEvent>({
	id: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: false },
	startDateTime: { type: unifiedDateTimeSchema, required: true },
	endDateTime: { type: unifiedDateTimeSchema, required: true },
	timeZone: { type: String, required: false },
	location: { type: String, required: false },
	organizerEmail: { type: String, required: false },
	attendees: { type: [unifiedCalendarAttendeeSchema], required: true },
	isAllDay: { type: Boolean, required: true },
	recurrence: { type: recurrenceSchema, required: false },
	source: { type: String, required: true, enum: ["google", "microsoft", "local"] },
	link: { type: String, required: false },
	isActive: { type: Boolean, required: true }
})

export default calendarDataSchema
