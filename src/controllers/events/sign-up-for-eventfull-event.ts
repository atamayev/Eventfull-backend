import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"
import updateUserAttendingStatus from "../../utils/events/update-user-attending-status"

export default async function signUpForEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const isUserAttendingEvent = req.isUserAttendingEvent
		if (isUserAttendingEvent === true) {
			return res.status(200).json({ message: "User is already attending event" })
		}
		const user = req.user
		const event = req.event

		if (_.isEqual(event.organizerId, user._id)) return res.status(200).json({ message: "You are the event organizer" })

		const eventIndex = user.eventfullEvents.findIndex(event1 => event1.eventId.toString() === event._id.toString())

		await updateUserAttendingStatus(user._id, event._id, eventIndex)

		const isUserInvited = event.invitees.some(invitee => _.isEqual(invitee.userId, user._id))
		if (isUserInvited === false) {
			await EventfullEventModel.updateOne(
				{ _id: event._id },
				{ $addToSet: {
					attendees: {
						userId: user._id
					}
				}}
			)
		} else {
			const invitee = event.invitees.find(inv => _.isEqual(inv.userId, user._id))

			const invitedById = invitee ? invitee.invitedBy : null
			await EventfullEventModel.updateOne(
				{ _id: event._id },
				{
					$pull: { invitees: { userId: user._id } },
					$addToSet: { attendees: { userId: user._id, invitedBy: invitedById } }
				}
			)
		}
		return res.status(200).json({ message: "Signed up for Event" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
