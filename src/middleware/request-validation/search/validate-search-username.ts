import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const usernameSchema = Joi.object({
	username: Joi.string().allow("").optional()
}).required()

export default function validateSearchUsername (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = usernameSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid username" })

		if (!_.isUndefined(req.params.username)) {
			const trimmedUsername = req.params.username.trim()
			req.params.username = trimmedUsername
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Search Username" })
	}
}
