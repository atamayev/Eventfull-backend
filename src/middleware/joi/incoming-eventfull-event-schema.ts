import Joi from "joi"
import objectIdValidation from "../../utils/object-id-validation"

const socialDataSchema = Joi.object({
	userId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	username: Joi.string().required()
})

const eventTimesSchema = Joi.object({
	startTime: Joi.date().required(),
	endTime: Joi.date().required(),
	eventDuration: Joi.object({
		hours: Joi.number().integer().min(0).required(),
		minutes: Joi.number().integer().min(0).max(59).required()
	}).required()
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
	eventDescription: Joi.string().required(),

	eventURL: Joi.string().optional(),
	extraEventCategories: Joi.array().items(Joi.string()).optional(),
	eventImageURL: Joi.string().optional(),
	singularEventTime: eventTimesSchema.optional().allow(null),

	ongoingEventTimes: Joi.array().items(Joi.object({
		dayOfWeek: Joi.string().valid("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday").required(),
		startTime: Joi.date().required(),
		endTime: Joi.date().required(),
		eventDuration: Joi.object({
			hours: Joi.number().integer().min(0).required(),
			minutes: Joi.number().integer().min(0).max(59).required()
		}).required()
	})).optional(),

	customEventDates: Joi.array().items(eventTimesSchema).optional(),

	invitees: Joi.array().items(socialDataSchema).optional(),
	coHosts: Joi.array().items(socialDataSchema).optional(),
	eventCapacity: Joi.number().optional()
}).required()

export default incomingEventfullEventSchema
