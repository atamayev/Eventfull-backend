import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const changePasswordSchema = Joi.object({
	changePasswordObject: Joi.object({
		email: Joi.string().email().required(),
		currentPassword: Joi.string().min(6).required(),
		newPassword: Joi.string().min(6).required()
	}).required()
})

export default function validateChangePasswordRequest(req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = changePasswordSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
