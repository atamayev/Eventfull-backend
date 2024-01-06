import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const updatedPrivateChatSchema = Joi.object({
	updatedPrivateChatName: Joi.string().min(1).max(200).required()
}).unknown(true)

export default function validateUpdatedPrivateChatName (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = updatedPrivateChatSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Private Message Chat Name" })
	}
}
