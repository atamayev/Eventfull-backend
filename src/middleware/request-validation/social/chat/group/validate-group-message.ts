import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../../../utils/object-id-validation"

const groupMessageSchema = Joi.object({
	newGroupMessageId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	groupMessage: Joi.string().min(1).max(1000).required(),
}).required()

export default function validateGroupMessage (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = groupMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Group Message" })
	}
}
