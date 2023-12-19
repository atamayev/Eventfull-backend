import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function checkIfEventCapacityFull(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const event = req.event

		if (_.isEmpty(event.attendees) || event.eventCapacity === null) {
			next()
			return
		}
		if (event.attendees.length >= event.eventCapacity) {
			return res.status(400).json({ error: "Event capacity full" })
		}
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
