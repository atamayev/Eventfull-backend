import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findEvent from "../../../utils/find/find-event"
import objectIdValidation from "../../../utils/object-id-validation"

const eventfullEventIdSchema = Joi.object({
	eventfullEventId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).required()

export default async function validateEventfullEventId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = eventfullEventIdSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const event = await findEvent(req.params.eventfullEventId as unknown as Types.ObjectId)

		if (_.isNull(event)) return res.status(400).json({ message: "Event not found" })

		req.event = event

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Eventfull Event Id" })
	}
}
