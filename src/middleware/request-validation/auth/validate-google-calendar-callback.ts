import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const googleCalendarCode = Joi.object({
	code: Joi.string().required()
})

export default function validateGoogleCalendarCallback (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = googleCalendarCode.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()

}
