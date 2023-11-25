import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const querySchema = Joi.object({
	code: Joi.required()
}).unknown(true)

export default function validateQueryCode (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = querySchema.validate(req.query)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
