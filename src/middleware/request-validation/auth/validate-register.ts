import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const registerInformationSchema = Joi.object({
	registerInformationObject: Joi.object({
		contact: Joi.string().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		// Makes sure that the username does not contain an @ symbol
		username: Joi.string().required().pattern(new RegExp("^[^@]*$")),
		password: Joi.string().min(6).required()
	}).required()
})

export default function validateRegister (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = registerInformationSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
