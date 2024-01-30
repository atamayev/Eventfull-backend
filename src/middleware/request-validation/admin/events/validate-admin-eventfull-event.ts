import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import incomingAdminEventfullEventSchema from "../../../joi/admin-eventfull-event-schema"

export default function validateAdminCreateEventfullEvent (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const eventfullEventData = req.body.eventfullEventData
		const { error } = incomingAdminEventfullEventSchema.validate(eventfullEventData)
		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Create Eventfull Event" })
	}
}
