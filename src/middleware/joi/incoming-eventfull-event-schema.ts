import Joi from "joi"
import { unifiedDateTimeSchema } from "./unified-calendar-event-schema"
import objectIdValidation from "../../utils/object-id-validation"

const incomingEventfullEventSchema = Joi.object({
	eventfullEventData: Joi.object({
		eventName: Joi.string().required(),
		eventTimeStart: unifiedDateTimeSchema.required(),
		eventTimeEnd: unifiedDateTimeSchema.required(),
		eventPrice: Joi.number().required(),
		eventType: Joi.string().required(),
		isVirtual: Joi.boolean().required(),
		eventPublic: Joi.boolean().required(),
		eventReviewable: Joi.boolean().required(),
		coHosts: Joi.array().items(Joi.custom(objectIdValidation, "Object ID Validation")),
		canInvitedUsersInviteOthers: Joi.boolean().required(),
		invitees: Joi.array().items(Joi.string()).optional(),
		eventURL: Joi.string().optional(),
		extraEventCategories: Joi.array().items(Joi.string()).optional(),
		eventDescription: Joi.string().optional(),
		eventLocation: Joi.object({
			address: Joi.string().required()
		}).optional(),
		eventCapacity: Joi.number().optional()
	}).required()
})

export default incomingEventfullEventSchema
