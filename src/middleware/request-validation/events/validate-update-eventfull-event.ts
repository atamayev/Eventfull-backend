import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import updatedEventfullEventSchema from "../../joi/updated-eventfull-event-schema"

const combinedUpdateEventSchema = Joi.object({
	eventfullEventData: updatedEventfullEventSchema,
	numberOfImages: Joi.number().required()
}).required()

export default function validateUpdateEventfullEvent (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = combinedUpdateEventSchema.validate(req.body)
		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Update Eventfull Event" })
	}
}
