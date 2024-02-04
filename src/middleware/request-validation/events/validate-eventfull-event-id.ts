import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findEvent from "../../../utils/find/find-event"
import objectIdValidation from "../../../utils/object-id-validation"

const eventfullEventIdSchema = Joi.object({
	eventfullEventId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).unknown(true)

export default async function validateEventfullEventId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = eventfullEventIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const eventfullEventId = new Types.ObjectId(req.body.eventfullEventId as string)

		const event = await findEvent(eventfullEventId)

		if (_.isNull(event)) return res.status(400).json({ message: "Event not found" })

		req.event = event as EventfullEvent

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Eventfull Event Id" })
	}
}
