import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const inviteResponseSchema = Joi.object({
	newMessageStatus: Joi.string().valid("Read", "Delivered").required(),
}).unknown(true)

export default function validateUpdatedMessageStatus (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = inviteResponseSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Updated Message Status" })
	}
}