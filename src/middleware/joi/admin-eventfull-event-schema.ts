import Joi from "joi"
import { unifiedDateTimeSchema } from "./unified-calendar-event-schema"

const incomingAdminEventfullEventSchema = Joi.object({
	eventName: Joi.string().required(),
	eventFrequency: Joi.string().valid("one-time", "repeated", "regularly-repeated", "ongoing").required(),
	address: Joi.string().required(),
	eventDuration: Joi.object({
		hours: Joi.number().required(),
		minutes: Joi.number().required(),
	}).required(),
	eventDescription: Joi.string().required(),
	eventPrice: Joi.number().required(),

	eventURL: Joi.string().optional(),

	ongoingEventTimes: Joi.array().items(Joi.object({
		dayOfWeek: Joi.string().valid("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday").required(),
		startTime: Joi.string().required(),
		endTime: Joi.string().required(),
	})).optional(),

	dates: Joi.array().items(Joi.object({
		startDateTime: unifiedDateTimeSchema.required(),
		endDateTime: unifiedDateTimeSchema.required(),
	})).optional(),

	eventTime: Joi.date().optional(),
}).required()

export default incomingAdminEventfullEventSchema
