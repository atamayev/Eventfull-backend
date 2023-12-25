import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const eventNameSchema = Joi.object({
	eventName: Joi.string().required()
})

export default function validateSearchEventName (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = eventNameSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid Event Name" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Search Event Name" })
	}
}
