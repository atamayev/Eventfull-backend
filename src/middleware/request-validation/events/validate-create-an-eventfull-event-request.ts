import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import incomingEventfullEventSchema from "../../joi/eventfull-event-schema"

export default function validateCreateAnEventfullEventRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = incomingEventfullEventSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
