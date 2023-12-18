import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmAbleToInviteFriend(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const friend = req.friend
		const event = req.event

		// Check if friend is already attending event
		if (_.isEmpty(event.attendees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}
		const attendeeIds = event.attendees.map(attendee => attendee.userId.toString())
		attendeeIds.push(event.organizerId.toString())

		if (attendeeIds.includes(friend._id.toString()) === true) {
			return res.status(403).json({ error: "Friend is already attending Event" })
		}

		// Check if friend has already responded "Not Attending"
		const hasRespondedNotAttending = friend.eventfullEvents.some(event1 =>
			event1.eventId.toString() === event._id.toString() && event1.attendingStatus === "Not Attending"
		)

		if (hasRespondedNotAttending === true) {
			return res.status(400).json({ error: "Friend has already responded 'Not Attending'" })
		}

		// Check if friend is already invited
		if (_.isEmpty(event.invitees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}
		const inviteesIds = event.invitees.map(invitee => invitee.userId.toString())
		inviteesIds.push(event.organizerId.toString())

		if (inviteesIds.includes(friend._id.toString()) === true) {
			return res.status(403).json({ error: "Friend is already invited" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
