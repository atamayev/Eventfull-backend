import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const updatedDirectMessageChatSchema = Joi.object({
	updatedDirectMessageChatName: Joi.string().min(1).max(200).required()
}).unknown(true)

export default function validateUpdatedDirectMessageChatName (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = updatedDirectMessageChatSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Direct Message Chat Name" })
	}
}