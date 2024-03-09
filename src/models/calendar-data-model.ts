import { Schema } from "mongoose"

const eventTimeSchema = new Schema<CalendarBaseEventTime>({
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true }
}, { _id: false, timestamps: true })

const unifiedCalendarAttendeeSchema = new Schema<UnifiedCalendarAttendee>({
	email: { type: String, required: true },
	responseStatus: { type: String, required: false }
}, { _id: false, timestamps: true })

const recurrenceSchema = new Schema<UnifiedRecurrence>({
	pattern: { type: String, required: true },
	interval: { type: Number, required: true }
}, { _id: false, timestamps: true })

const calendarDataSchema = new Schema<UnifiedCalendarEvent>({
	id: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: false },
	eventTime: { type: eventTimeSchema },
	timeZone: { type: String, required: false },
	location: { type: String, required: false },
	organizerEmail: { type: String, required: false },
	attendees: { type: [unifiedCalendarAttendeeSchema], required: true },
	isAllDay: { type: Boolean, required: true },
	recurrence: { type: recurrenceSchema, required: false },
	source: { type: String, required: true, enum: ["Google", "Microsoft", "Local"] },
	link: { type: String, required: false },
	isActive: { type: Boolean, required: true }
})

export default calendarDataSchema
