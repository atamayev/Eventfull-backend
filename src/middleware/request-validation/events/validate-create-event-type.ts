import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const categoriesSchema = Joi.object({
	categoryId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	eventCategoryName: Joi.string().required(),
	description: Joi.string().required()
}).required()

const eventTypeSchema = Joi.object({
	eventTypeDetails: Joi.object({
		eventTypeName: Joi.string().required(),
		description: Joi.string().required(),
		categories: Joi.array().items(categoriesSchema).required(),
	}).required()
}).required()

export default function validateCreateEventType (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = eventTypeSchema.validate(req.body)
		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Event Type" })
	}
}
