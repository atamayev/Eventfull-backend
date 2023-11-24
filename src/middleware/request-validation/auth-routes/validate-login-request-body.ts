import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const loginInformationSchema = Joi.object({
	loginInformationObject: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required()
	}).required()
})

export default function validateLoginRequestBody (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = loginInformationSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
