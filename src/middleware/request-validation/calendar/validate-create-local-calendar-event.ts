import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { partialUnifiedCalendarEventSchema } from "../../joi/unified-calendar-event-schema"

export default function validateCreateLocalCalendarEvent (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = partialUnifiedCalendarEventSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Create Local Calendar Event" })
	}
}
