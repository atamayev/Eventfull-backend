import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const querySchema = Joi.object({
	code: Joi.required(),
	idToken: Joi.required()
})

export default function validateGoogleQueryCode (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = querySchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
