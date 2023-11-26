import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const contactSchema = Joi.object({
	contact: Joi.string().required()
})

export default function validateCheckIfContactExistsRequest(req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = contactSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
