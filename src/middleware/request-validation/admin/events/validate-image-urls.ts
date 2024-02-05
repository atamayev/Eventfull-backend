import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const imageURLsSchema = Joi.object({
	imageURLs: Joi.array().items(Joi.object({
		imageId: Joi.string().uuid().required(),
		imageURL: Joi.string().uri().required(),
		isActive: Joi.boolean().required()
	})).required()
}).required()

export default function validateImageURLs (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = imageURLsSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Image URLs" })
	}
}
