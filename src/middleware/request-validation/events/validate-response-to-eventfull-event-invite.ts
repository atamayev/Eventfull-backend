import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const inviteResponseSchema = Joi.object({
	eventfullEventId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	response: Joi.string().valid("Attending", "Not Attending", "Not Responded").required(),
}).required()

export default function validateResponseToEventfullEventInvite (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = inviteResponseSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Response to Eventfull Event Invite" })
	}
}
