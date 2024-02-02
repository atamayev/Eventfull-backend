import Joi from "joi"
import objectIdValidation from "../../utils/object-id-validation"

export const socialDataSchema = Joi.object({
	userId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	username: Joi.string().required()
})

const socialDataWithTimestampSchema = Joi.object({
	userId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	username: Joi.string().required(),
	createdAt: Joi.string().isoDate().required()
})

const eventfullInviteeSchema = Joi.object({
	user: socialDataSchema.required(),
	attendingStatus: Joi.string().valid("Not Attending", "Not Responded").required(),
	invitedBy: socialDataWithTimestampSchema.required()
})

const eventfullCoHostSchema = Joi.object({
	user: socialDataSchema.required(),
	invitedBy: socialDataWithTimestampSchema.required()
})

const eventfullAttendeesSchema = Joi.object({
	user: socialDataSchema.required(),
	invitedBy: socialDataWithTimestampSchema.optional(),
	reviewRating: Joi.number().optional(),
	reviewText: Joi.string().optional()
})

const eventTimesSchema = Joi.object({
	startTime: Joi.string().isoDate().required(),
	endTime: Joi.string().isoDate().required(),
	eventDuration: Joi.object({
		hours: Joi.number().integer().min(0).required(),
		minutes: Joi.number().integer().min(0).max(59).required()
	}).required()
})

const createdBySchema = Joi.object({
	userId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	username: Joi.string().required(),
	createdAt: Joi.string().isoDate().required(),
	isCreatedByAdmin: Joi.boolean().required()
})

const updatedEventfullEventSchema = Joi.object({
	_id: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
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
		startTime: Joi.string().isoDate().required(),
		endTime: Joi.string().isoDate().required(),
		eventDuration: Joi.object({
			hours: Joi.number().integer().min(0).required(),
			minutes: Joi.number().integer().min(0).max(59).required()
		}).required()
	})).optional(),

	customEventDates: Joi.array().items(eventTimesSchema).optional(),

	invitees: Joi.array().items(eventfullInviteeSchema).required(),
	coHosts: Joi.array().items(eventfullCoHostSchema).required(),
	attendees: Joi.array().items(eventfullAttendeesSchema).required(),
	eventCapacity: Joi.number().optional().allow(null),
	createdBy: createdBySchema.required(),
	createdAt: Joi.string().isoDate().required(),
	updatedAt: Joi.string().isoDate().required()
}).required()

export default updatedEventfullEventSchema
