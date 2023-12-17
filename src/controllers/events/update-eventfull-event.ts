import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function updateEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string
		const updatedEventData  = req.body.eventfullEventData as IncomingEventfullEvent
		const organizerOrCoHost = req.organizerOrCoHost as "Organizer" | "Co-Host"
		// If Organizer, can add/delete co-hosts. If Co-Host, cannot add co-hosts

		const currentEvent = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(currentEvent)) return res.status(404).json({ error: "Event not found" })

		const user = await UserModel.findById(userId).select("friends")
		const friendIds = user?.friends.map(friend => friend.toString()) || []

		const newInvitees = updatedEventData.invitees
			.filter(inviteeId => friendIds.includes(inviteeId.toString()))
			.map(inviteeId => ({
				userId: inviteeId,
				attendingStatus: "Not Responded",
				invitedBy: userId,
			}))

		const inviteesToAdd = newInvitees.filter(newInvitee =>
			!currentEvent.invitees.some(existingInvitee =>
				existingInvitee.userId.toString() === newInvitee.userId.toString()
			)
		)

		const inviteesToRemove = currentEvent.invitees.filter(existingInvitee =>
			!updatedEventData.invitees.some(newInviteeId =>
				existingInvitee.userId === newInviteeId
			) && existingInvitee.attendingStatus === "Not Responded"
		)

		const { invitees, ...eventDataToUpdate } = updatedEventData

		const deleteInviteesPromise = EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{ $pull: { invitees: { userId: { $in: inviteesToRemove.map(invitee => invitee.userId) } } } },
			{ new: true, runValidators: true }
		)

		const addInviteesPromise = EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{
				$set: eventDataToUpdate,
				$push: { invitees: { $each: inviteesToAdd } }
			},
			{ new: true, runValidators: true }
		)

		const addInviteesPromises = inviteesToAdd.map(invitee =>
			UserModel.updateOne(
				{ _id: invitee.userId },
				{
					$push: {
						eventfullEvents: {
							eventId: eventfullEventId,
							attendingStatus: "Not Responded",
							invitedBy: userId
						}
					}
				})
		)

		const removeInviteesPromises = inviteesToRemove.map(invitee =>
			UserModel.updateOne(
				{ _id: invitee.userId },
				{ $pull: { eventfullEvents: { eventId: eventfullEventId } } }
			)
		)

		await Promise.all([
			deleteInviteesPromise,
			addInviteesPromise,
			...addInviteesPromises,
			...removeInviteesPromises
		])

		return res.status(200).json({ message: "Event Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
