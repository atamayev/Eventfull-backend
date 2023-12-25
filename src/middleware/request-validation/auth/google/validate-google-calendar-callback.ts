import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const googleCalendarCallbackSchema = Joi.object({
	code: Joi.string().required()
})

export default function validateGoogleCalendarCallback (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = googleCalendarCallbackSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

	next()

}
