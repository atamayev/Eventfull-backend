import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const calendarIdSchema = Joi.object({
	calendarId: Joi.string().required()
}).required()

export default function validateCalendarIdInParams (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = calendarIdSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid calendar ID" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Calendar ID" })
	}
}
