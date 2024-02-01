import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const secondaryAdminRegisterInfoSchema = Joi.object({
	secondaryAdminRegisterInformation: Joi.object({
		// // Makes sure that the username does not contain an @ symbol, as that is reserved for the contact field
		username: Joi.string().required().pattern(new RegExp("^[^@]*$")),
		password: Joi.string().min(6).required(),
	}).required()
})

export default function validateSecondaryAdminRegisterInfo (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = secondaryAdminRegisterInfoSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Registration" })
	}
}
