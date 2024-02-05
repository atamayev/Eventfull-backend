import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const contactSchema = Joi.object({
	contact: Joi.string().required()
}).required()

export default function validateContact(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = contactSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedContact = req.body.contact.trim()
		req.body.contact = trimmedContact

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Contact" })
	}
}
