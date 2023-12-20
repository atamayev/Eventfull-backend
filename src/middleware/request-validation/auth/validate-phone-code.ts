import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const phoneCodeSchema = Joi.object({
	// Exactly 6 digits
	code: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
})

export default function validatePhoneCode (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = phoneCodeSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
