import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const eventCategorySchema = Joi.object({
	eventCategoryDetails: Joi.object({
		_id: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
		eventCategoryName: Joi.string().required(),
		description: Joi.string().required(),
		createdAt: Joi.date().required(),
		updatedAt: Joi.date().required(),
		createdBy: Joi.object({
			adminId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
			username: Joi.string().required()
		}).required(),
	}).required(),
}).required()

export default function validateUpdateEventCategory (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = eventCategorySchema.validate(req.body)
		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Event category" })
	}
}
