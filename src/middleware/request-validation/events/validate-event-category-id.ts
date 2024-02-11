import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const eventIdSchema = Joi.object({
	eventCategoryId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).required()

export default function validateEventCategoryId (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = eventIdSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid event category Id" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate event category Id" })
	}
}
