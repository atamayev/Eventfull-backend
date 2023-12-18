import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function checkIfUserAttendingEventfullEvent(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string
		const objectEventId = new Types.ObjectId(eventfullEventId)

		const event = await EventfullEventModel.findById(objectEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		if (_.isUndefined(event.attendees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}
		const attendeeIds = event.attendees.map(attendee => attendee.userId.toString())
		attendeeIds.push(event.organizerId.toString())

		req.isUserAttendingEvent = attendeeIds.includes(userId.toString())

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
