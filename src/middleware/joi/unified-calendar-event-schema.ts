import Joi from "joi"

export const unifiedDateTimeSchema = Joi.object({
	date: Joi.string().required(),
	time: Joi.string().required()
}).unknown(true)

const unifiedCalendarAttendeeSchema = Joi.object({
	email: Joi.string().email().required(),
	responseStatus: Joi.string().optional()
})

const unifiedRecurrenceSchema = Joi.object({
	pattern: Joi.string().required(),
	interval: Joi.number().required()
})

export function createFullUnifiedCalendarEventSchema(sourceType: "google" | "microsoft" | "local"): Joi.ObjectSchema {
	return Joi.object({
		calendarDetails: Joi.object({
			id: Joi.string().required(),
			source: Joi.string().valid(sourceType).required(),
			title: Joi.string().required(),
			description: Joi.string().optional(),
			startDateTime: unifiedDateTimeSchema.required(),
			endDateTime: unifiedDateTimeSchema.required(),
			timeZone: Joi.string().optional(),
			location: Joi.string().optional(),
			organizerEmail: Joi.string().email().optional(),
			attendees: Joi.array().items(unifiedCalendarAttendeeSchema).required(),
			isAllDay: Joi.boolean().required(),
			recurrence: unifiedRecurrenceSchema.optional(),
			link: Joi.string().optional()
		}).required()
	})
}

export const partialUnifiedCalendarEventSchema = Joi.object({
	calendarDetails: Joi.object({
		title: Joi.string().required(),
		description: Joi.string().optional(),
		startDateTime: unifiedDateTimeSchema.required(),
		endDateTime: unifiedDateTimeSchema.required(),
		timeZone: Joi.string().optional(),
		location: Joi.string().optional(),
		organizerEmail: Joi.string().email().optional(),
		attendees: Joi.array().items(unifiedCalendarAttendeeSchema).required(),
		isAllDay: Joi.boolean().required(),
		recurrence: unifiedRecurrenceSchema.optional(),
		link: Joi.string().optional()
	}).required()
})
