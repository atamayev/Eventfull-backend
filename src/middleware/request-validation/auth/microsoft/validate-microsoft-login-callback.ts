import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const microsoftLoginCallbackSchema = Joi.object({
	code: Joi.required(),
}).unknown(true)

export default function validateMicrosoftLoginCallback (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = microsoftLoginCallbackSchema.validate(req.query)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
