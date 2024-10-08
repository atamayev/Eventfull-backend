import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const usernameSchema = Joi.object({
	username: Joi.string().min(4).required()
}).required()

export default function validateUsername(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = usernameSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedUsername = req.body.username.trim()
		req.body.username = trimmedUsername

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Username" })
	}
}
