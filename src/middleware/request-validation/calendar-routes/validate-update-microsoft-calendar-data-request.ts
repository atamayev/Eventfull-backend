import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { createFullUnifiedCalendarEventSchema } from "../../joi/unified-calendar-event-schema"

export default function validateUpdateMicrosoftCalendarData (req: Request, res: Response, next: NextFunction): void | Response {
	const fullUnifiedCalendarEventSchema = createFullUnifiedCalendarEventSchema("microsoft")
	const { error } = fullUnifiedCalendarEventSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
