import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import updateUserAttendingStatus from "../../utils/events/update-user-attending-status"

export default async function signUpForEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string

		const event = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(event)) return res.status(404).json({ error: "Event not found" })

		if (_.isEqual(event.organizerId, userId)) return res.status(200).json({ message: "You are the event organizer" })

		const user = await UserModel.findOne({ _id: userId })
		if (_.isNull(user)) return res.status(404).json({ error: "User not found" })
		const eventIndex = user.eventfullEvents.findIndex(event1 => event1.eventId.toString() === eventfullEventId)

		await updateUserAttendingStatus(userId, eventfullEventId, eventIndex)

		const isUserInvited = event.invitees.some(invitee => invitee.userId.equals(userId))
		if (isUserInvited === false) {
			await EventfullEventModel.updateOne(
				{ _id: eventfullEventId },
				{ $addToSet: {
					attendees: {
						userId: userId
					}
				}}
			)
		} else {
			const invitee = event.invitees.find(inv => inv.userId.equals(userId))

			const invitedById = invitee ? invitee.invitedBy : null
			await EventfullEventModel.updateOne(
				{ _id: eventfullEventId },
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
