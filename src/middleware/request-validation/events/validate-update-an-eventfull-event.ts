import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import incomingEventfullEventSchema from "../../joi/incoming-eventfull-event-schema"
import objectIdValidation from "../../../utils/object-id-validation"

const updateEventfullEventSchema = Joi.object({
	eventfullEventId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	eventfullEventData: incomingEventfullEventSchema
}).required()

export default function validateUpdateEventfullEvent (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = updateEventfullEventSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
