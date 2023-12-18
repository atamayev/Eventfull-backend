import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const usernameSchema = Joi.object({
	username: Joi.string().required()
})

export default function validateUsernameInBody(req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = usernameSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}