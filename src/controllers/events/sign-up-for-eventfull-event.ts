import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"
import updateUserAttendingStatus from "../../utils/events/update-user-attending-status"

// eslint-disable-next-line max-lines-per-function
export default async function signUpForEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const isUserAttendingEvent = req.isUserAttendingEvent
		if (isUserAttendingEvent === true) {
			return res.status(400).json({ message: "User is already attending event" })
		}
		const user = req.user
		const event = req.event

		if (_.isEqual(event.organizer?.userId, user._id)) {
			return res.status(400).json({ message: "You are the event organizer" })
		}

		const eventIndex = user.eventfullEvents.findIndex(event1 => event1.eventId.toString() === event._id.toString())

		await updateUserAttendingStatus(user._id, event._id, eventIndex)

		const isUserInvited = event.invitees.some(invitee => _.isEqual(invitee.user.userId, user._id))
		if (isUserInvited === false) {
			await EventfullEventModel.findByIdAndUpdate(
				event._id,
				{ $addToSet: {
					attendees: { user: {
						userId: user._id,
						username: user.username,
					} }
				}},
				{ runValidators: true }
			)
		} else {
			const invitee = event.invitees.find(inv => _.isEqual(inv.user.userId, user._id))

			await EventfullEventModel.findByIdAndUpdate(
				event._id,
				{
					$pull: { invitees: { "user.userId" : user._id } },
					$addToSet: {
						attendees: {
							user: {
								userId: user._id,
								username: user.username,
							},
							invitedBy: {
								userId: invitee ? invitee.user.userId : null,
								username: invitee ? invitee.user.username : null,
							}
						}
					}
				},
				{ runValidators: true }
			)
		}
		return res.status(200).json({ success: "Signed up for Event" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Sign Up for Eventfull Event" })
	}
}
