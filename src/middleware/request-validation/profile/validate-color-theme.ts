import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const colorThemeSchema = Joi.object({
	colorTheme: Joi.string().valid("Dark", "Light", "System Default").required()
}).required()

export default function validateColorTheme (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = colorThemeSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid Color Theme" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Color Theme" })
	}
}
