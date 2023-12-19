import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import incomingEventfullEventSchema from "../../joi/incoming-eventfull-event-schema"

export default function validateCreateEventfullEventRequest (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const eventfullEventData = req.body.eventfullEventData
		const { error } = incomingEventfullEventSchema.validate(eventfullEventData)
		if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
