import Joi from "joi"
import { socialDataSchema } from "./updated-eventfull-event-schema"

const eventTimesSchema = Joi.object({
	startTime: Joi.string().isoDate().required(),
	endTime: Joi.string().isoDate().required(),
	eventDuration: Joi.object({
		hours: Joi.number().integer().min(0).required(),
		minutes: Joi.number().integer().min(0).max(59).required()
	}).required()
})

const ongoingEventTimeSchema = Joi.object({
	startTime: Joi.string().isoDate().required(),
	endTime: Joi.string().isoDate().required(),
	eventDuration: Joi.object({
		hours: Joi.number().integer().min(0).required(),
		minutes: Joi.number().integer().min(0).max(59).required()
	}).required(),
	dayOfWeek: Joi.string().valid("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday").required()
})

const incomingEventfullEventSchema = Joi.object({
	eventName: Joi.string().required(),
	eventPrice: Joi.number().required(),
	eventType: Joi.string().valid("Entertainment").required(),
	isVirtual: Joi.boolean().required(),
	isActive: Joi.boolean().required(),
	eventPublic: Joi.boolean().required(),
	eventReviewable: Joi.boolean().required(),
	canInvitedUsersInviteOthers: Joi.boolean().required(),
	eventFrequency: Joi.string().valid("one-time", "custom", "ongoing").required(),
	address: Joi.string().required(),
	eventDescription: Joi.string().allow("").optional(),

	eventURL: Joi.string().allow("").optional(),
	extraEventCategories: Joi.array().items(Joi.string()).optional(),

	singularEventTime: eventTimesSchema.optional().allow(null),

	ongoingEventTimes: Joi.array().items(ongoingEventTimeSchema).optional(),

	customEventDates: Joi.array().items(eventTimesSchema).optional(),

	invitees: Joi.array().items(socialDataSchema).required(),
	coHosts: Joi.array().items(socialDataSchema).required(),
	eventCapacity: Joi.number().optional().allow(null)
}).required()

export default incomingEventfullEventSchema
