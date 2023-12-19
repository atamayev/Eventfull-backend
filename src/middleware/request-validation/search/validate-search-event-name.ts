import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const eventNameSchema = Joi.object({
	eventName: Joi.string().required()
})

export default function validateSearchEventName (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = eventNameSchema.validate(req.params)

	if (!_.isUndefined(error)) return res.status(400).json({ error: "Invalid event name" })

	next()
}
