import { Request, Response, NextFunction } from "express"

export default function confirmAbleToInviteFriend(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const friend = req.friend
		const event = req.event

		// Check if friend is already attending event
		const attendeeIds = event.attendees.map(attendee => attendee.userId.toString())
		attendeeIds.push(event.organizerId.toString())

		if (attendeeIds.includes(friend._id.toString()) === true) {
			return res.status(400).json({ message: "Friend is already attending Event" })
		}

		// Check if friend has already responded "Not Attending"
		const hasRespondedNotAttending = friend.eventfullEvents.some(event1 =>
			event1.eventId.toString() === event._id.toString() && event1.attendingStatus === "Not Attending"
		)

		if (hasRespondedNotAttending === true) {
			return res.status(400).json({ message: "Friend has already responded 'Not Attending'" })
		}

		// Check if friend is already invited
		const inviteesIds = event.invitees.map(invitee => invitee.userId.toString())
		inviteesIds.push(event.organizerId.toString())

		if (inviteesIds.includes(friend._id.toString()) === true) {
			return res.status(400).json({ message: "Friend is already invited" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify that Friend Can be invited to Event" })
	}
}
