import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const googleLoginCallbackSchema = Joi.object({
	code: Joi.required(),
	idToken: Joi.required()
})

export default function validateGoogleLoginCallback (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = googleLoginCallbackSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}