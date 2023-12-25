import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const usernameSchema = Joi.object({
	username: Joi.string().allow("").optional()
})

export default function validateSearchUsername (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = usernameSchema.validate(req.params)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid username" })

	if (!_.isUndefined(req.params.username)) {
		const trimmedUsername = req.params.username.trim()
		req.params.username = trimmedUsername
	}
	next()
}
