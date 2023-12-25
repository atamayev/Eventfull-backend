import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { createFullUnifiedCalendarEventSchema } from "../../joi/unified-calendar-event-schema"

export default function validateUpdateLocalCalendarEvent (req: Request, res: Response, next: NextFunction): void | Response {
	const fullUnifiedCalendarEventSchema = createFullUnifiedCalendarEventSchema("local")
	const { error } = fullUnifiedCalendarEventSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

	next()
}
