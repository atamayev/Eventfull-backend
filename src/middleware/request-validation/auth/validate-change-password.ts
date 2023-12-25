import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const changePasswordSchema = Joi.object({
	changePasswordObject: Joi.object({
		contact: Joi.string().required(),
		currentPassword: Joi.string().min(6).required(),
		newPassword: Joi.string().min(6).required()
	}).required()
})

export default function validateChangePassword(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = changePasswordSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Change Password" })
	}
}
