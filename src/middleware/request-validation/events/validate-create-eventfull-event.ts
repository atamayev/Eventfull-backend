import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import newEventfullEventSchema from "../../joi/new-eventfull-event-schema"

const combinedEventSchema = Joi.object({
	eventfullEventData: newEventfullEventSchema,
	numberOfImages: Joi.number().min(1).required()
}).required()

export default function validateCreateEventfullEvent (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = combinedEventSchema.validate(req.body)
		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Create Eventfull Event" })
	}
}
