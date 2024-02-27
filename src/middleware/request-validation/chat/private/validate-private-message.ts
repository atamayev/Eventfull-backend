import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../../utils/object-id-validation"

const privateMessageSchema = Joi.object({
	newPrivateMessageId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	privateMessage: Joi.string().min(1).max(1000).required(),
}).unknown(true)

export default function validatePrivateMessage (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = privateMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to validate private message" })
	}
}
