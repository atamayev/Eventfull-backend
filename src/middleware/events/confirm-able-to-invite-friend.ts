import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function confirmAbleToInviteFriend(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const friendId = req.friendId
		const user = await UserModel.findById(friendId)
		if (_.isNull(user)) return res.status(404).json({ error: "User not found" })

		const eventfullEventId = req.body.eventfullEventId as string

		const event = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		// Check if friend is already attending event
		if (_.isEmpty(event.attendees)) {
			return res.status(404).json({ error: "Event has no invitees" })
		}
		const attendeeIds = event.attendees.map(attendee => attendee.userId.toString())
		attendeeIds.push(event.organizerId.toString())

		if (attendeeIds.includes(friendId.toString()) === true) {
			return res.status(403).json({ error: "Friend is already attending Event" })
		}

		// Check if friend has already responded "Not Attending"
		const hasRespondedNotAttending = user.eventfullEvents.some(event1 =>
			event1.eventId.toString() === eventfullEventId && event1.attendingStatus === "Not Attending"
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

		if (inviteesIds.includes(friendId.toString()) === true) {
			return res.status(403).json({ error: "Friend is already invited" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
