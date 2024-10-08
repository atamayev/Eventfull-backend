import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function checkIfUserAttendingEventfullEvent(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const event = req.event

		if (_.isEmpty(event.attendees)) {
			req.isUserAttendingEvent = false
			next()
			return
		}
		const attendeeIds = event.attendees.map(attendee => attendee.user.userId.toString())
		if (!_.isUndefined(event.organizer)) {
			attendeeIds.push(event.organizer.userId.toString())
		}

		req.isUserAttendingEvent = attendeeIds.includes(user._id.toString())

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User Attending Eventfull Event" })
	}
}
