import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const loginInformationSchema = Joi.object({
	loginInformationObject: Joi.object({
		contact: Joi.string().required(),
		password: Joi.string().min(6).required()
	}).required()
})

export default function validateLogin (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = loginInformationSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

	const trimmedContact = req.body.loginInformationObject.contact.trimEnd()
	req.body.loginInformationObject.contact = trimmedContact

	next()
}
