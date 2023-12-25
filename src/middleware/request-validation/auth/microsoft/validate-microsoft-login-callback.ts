import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const microsoftLoginCallbackSchema = Joi.object({
	code: Joi.required(),
}).unknown(true)

export default function validateMicrosoftLoginCallback (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = microsoftLoginCallbackSchema.validate(req.query)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Microsoft Login Callback" })
	}
}
