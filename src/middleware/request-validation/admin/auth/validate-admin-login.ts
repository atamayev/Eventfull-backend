import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const loginInformationSchema = Joi.object({
	loginInformation: Joi.object({
		contact: Joi.string().required(),
		password: Joi.string().min(6).required(),
	}).required()
}).required()

export default function validateAdminLogin (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = loginInformationSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedContact = req.body.loginInformation.contact.trimEnd()
		req.body.loginInformation.contact = trimmedContact

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Login" })
	}
}
