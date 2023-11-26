import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const usernameSchema = Joi.object({
	username: Joi.string().required()
})

export default function validateUsernameInParams (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = usernameSchema.validate(req.params)

	if (!_.isUndefined(error)) return res.status(400).json({ error: "Invalid username" })

	next()
}
