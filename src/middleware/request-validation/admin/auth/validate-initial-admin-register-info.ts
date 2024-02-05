import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const initialAdminRegisterInfoSchema = Joi.object({
	initialAdminRegisterInformation: Joi.object({
		email: Joi.string().email().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
	}).required()
}).required()

export default function validateInitialAdminRegisterInfo (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = initialAdminRegisterInfoSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedContact = req.body.initialAdminRegisterInformation.email.trimEnd()
		req.body.initialAdminRegisterInformation.email = trimmedContact
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Registration" })
	}
}
