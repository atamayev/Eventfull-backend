import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const registerInformationSchema = Joi.object({
	registerInformationObject: Joi.object({
		contact: Joi.string().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		// Makes sure that the username does not contain an @ symbol, as that is reserved for the contact field
		username: Joi.string().required().pattern(new RegExp("^[^@]*$")),
		password: Joi.string().min(6).required(),
		notificationToken: Joi.string().required(),
		primaryDevicePlatform: Joi.string().valid("ios" , "android" , "windows" , "macos" , "web").required()
	}).required()
}).required()

export default function validateRegister (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = registerInformationSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedContact = req.body.registerInformationObject.contact.trimEnd()
		req.body.registerInformationObject.contact = trimmedContact
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Registration" })
	}
}
