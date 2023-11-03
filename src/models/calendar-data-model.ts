import { Schema, } from "mongoose"

const calendarDataSchema = new Schema<CalendarData>({
	eventName: { type: String, required: true },
	start: {
		dateTime: { type: String, required: true },
		timeZone: { type: String, required: true },
	},
	end: {
		dateTime: { type: String, required: true },
		timeZone: { type: String, required: true },
	}
})

export default calendarDataSchema
