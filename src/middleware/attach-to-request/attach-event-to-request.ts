import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function attachEventToRequest(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const eventfullEventId = req.body.eventfullEventId as string
		const event = await EventfullEventModel.findById(eventfullEventId)

		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		req.event = event as EventfullEvent
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
