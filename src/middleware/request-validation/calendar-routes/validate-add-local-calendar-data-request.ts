import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const unifiedDateTimeSchema = Joi.object({
	date: Joi.string().required(),
	time: Joi.string().required()
})

const unifiedCalendarAttendeeSchema = Joi.object({
	email: Joi.string().email().required(),
	responseStatus: Joi.string().optional()
})

const unifiedRecurrenceSchema = Joi.object({
	pattern: Joi.string().required(),
	interval: Joi.number().required()
})

const unifiedCalendarEventSchema = Joi.object({
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

export default function validateAddLocalCalendarDataRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = unifiedCalendarEventSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
