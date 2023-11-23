import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const authorizationSchema = Joi.object({
	authorization: Joi.string().required()
}).required()

export default function validateAuthorizationHeader (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = authorizationSchema.validate(req.headers)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
