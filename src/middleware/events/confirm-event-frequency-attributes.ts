import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmEventFrequencyAttributes (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent
		if (eventfullEventData.eventFrequency === "one-time" && _.isNil(eventfullEventData.singularEventTime)) {
			return res.status(400).json({ error: "Bad Request: Missing Singular Event Time" })
		} else if (eventfullEventData.eventFrequency === "custom" && _.isEmpty(eventfullEventData.customEventDates)) {
			return res.status(400).json({ error: "Bad Request: Missing Custom Event Dates" })
		} else if (eventfullEventData.eventFrequency === "ongoing" && _.isEmpty(eventfullEventData.ongoingEventTimes)) {
			return res.status(400).json({ error: "Bad Request: Missing Ongoing Event Times" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Create Eventfull Event" })
	}
}
