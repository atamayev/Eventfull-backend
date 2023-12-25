import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const contactCodeSchema = Joi.object({
	// Exactly 6 digits
	code: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
})

export default function validateContactCode (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = contactCodeSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

	next()
}
