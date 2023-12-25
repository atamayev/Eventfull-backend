import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const calendarIdSchema = Joi.object({
	calendarId: Joi.string().required()
})

export default function validateCalendarIdInParams (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = calendarIdSchema.validate(req.params)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid calendar ID" })

	next()
}
