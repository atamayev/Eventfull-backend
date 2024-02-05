import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const appStateSchema = Joi.object({
	appState: Joi.string().valid("active", "inactive", "background").required()
}).required()

export default function validateUserSocketState (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = appStateSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate App State" })
	}
}
