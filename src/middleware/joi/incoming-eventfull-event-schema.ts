import Joi from "joi"
import objectIdValidation from "../../utils/object-id-validation"

const socialDataSchema = Joi.object({
	userId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	username: Joi.string().required()
})

const incomingEventfullEventSchema = Joi.object({
	eventName: Joi.string().required(),
	eventStartTime: Joi.date().required(),
	eventEndTime: Joi.date().required(),
	eventPrice: Joi.number().required(),
	eventType: Joi.string().required(),
	isVirtual: Joi.boolean().required(),
	eventPublic: Joi.boolean().required(),
	eventReviewable: Joi.boolean().required(),
	coHosts: Joi.array().items(socialDataSchema).required(),
	canInvitedUsersInviteOthers: Joi.boolean().required(),
	invitees: Joi.array().items(socialDataSchema).required(),
	eventCapacity: Joi.number().optional(),
	eventURL: Joi.string().optional(),
	extraEventCategories: Joi.array().items(Joi.string()).optional(),
	eventDescription: Joi.string().optional(),
	address: Joi.string().optional()
}).required()

export default incomingEventfullEventSchema
