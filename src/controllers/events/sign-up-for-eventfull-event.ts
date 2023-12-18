import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import updateUserAttendingStatus from "../../utils/events/update-user-attending-status"

export default async function signUpForEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const isUserAttendingEvent = req.isUserAttendingEvent
		if (isUserAttendingEvent === true) {
			return res.status(200).json({ message: "User is already attending event" })
		}
		const userId = req.userId
		const event = req.event

		if (_.isEqual(event.organizerId, userId)) return res.status(200).json({ message: "You are the event organizer" })

		const user = await UserModel.findById(userId)
		if (_.isNull(user)) return res.status(404).json({ error: "User not found" })
		const eventIndex = user.eventfullEvents.findIndex(event1 => event1.eventId.toString() === event._id.toString())

		await updateUserAttendingStatus(userId, event._id, eventIndex)

		const isUserInvited = event.invitees.some(invitee => _.isEqual(invitee.userId, userId))
		if (isUserInvited === false) {
			await EventfullEventModel.updateOne(
				{ _id: event._id },
				{ $addToSet: {
					attendees: {
						userId: userId
					}
				}}
			)
		} else {
			const invitee = event.invitees.find(inv => _.isEqual(inv.userId, userId))

			const invitedById = invitee ? invitee.invitedBy : null
			await EventfullEventModel.updateOne(
				{ _id: event._id },
				{
					$pull: { invitees: { userId: userId } },
					$addToSet: { attendees: { userId: userId, invitedBy: invitedById } }
				}
			)
		}
		return res.status(200).json({ message: "Signed up for Event" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
