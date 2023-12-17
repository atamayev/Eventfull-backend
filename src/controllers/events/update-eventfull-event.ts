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

		const currentEvent = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(currentEvent)) return res.status(404).json({ error: "Event not found" })

		const user = await UserModel.findById(userId).select("friends")
		const friendIds = user?.friends.map(friend => friend.toString()) || []

		// Removes invitees that are not friends of the organizer,
		// Maps each invitee to be invited by the user, and set the status as Not Responded
		const newInvitees = updatedEventData.invitees
			.filter(inviteeId => friendIds.includes(inviteeId.toString()))
			.map(inviteeId => ({
				userId: inviteeId,
				attendingStatus: "Not Responded",
				invitedBy: userId,
			}))

		// Removes invitees that are already invited to the event from being added again
		const inviteesToAdd = newInvitees.filter(newInvitee =>
			!currentEvent.invitees.some(existingInvitee =>
				existingInvitee.userId.toString() === newInvitee.userId.toString()
			)
		)

		// Removes invitees in the current event whose IDs are not in the updated event's invitees, but only if they have not responded yet
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

		if (organizerOrCoHost === "Organizer") {
			const currentHostIds = currentEvent.coHosts.map(host => host.toString())
			const newHostIds = updatedEventData.coHosts.map(host => host.toString())
			newHostIds.push(userId.toString())
			const coHostsToAdd = newHostIds.filter(coHostId => !currentHostIds.includes(coHostId))
			const coHostsToRemove = currentHostIds.filter(existingCoHost => !newHostIds.includes(existingCoHost))

			if (!_.isEmpty(coHostsToRemove)) {
				await EventfullEventModel.findByIdAndUpdate(
					eventfullEventId,
					{ $pull: { coHosts: { $in: coHostsToRemove } } },
					{ new: true, runValidators: true }
				)
				const removeCoHostsPromises = coHostsToRemove.map(coHostId =>
					UserModel.updateOne(
						{ _id: coHostId },
						{ $pull: { eventfullEvents: { eventId: eventfullEventId } } }
					)
				)
				await Promise.all(removeCoHostsPromises)
			}

			if (!_.isEmpty(coHostsToAdd)) {
				await EventfullEventModel.findByIdAndUpdate(
					eventfullEventId,
					{ $addToSet: { coHosts: { $each: coHostsToAdd } } },
					{ new: true, runValidators: true }
				)

				const addCoHostsPromises = coHostsToAdd.map(coHostId =>
					UserModel.updateOne(
						{ _id: coHostId },
						{
							$push: {
								eventfullEvents: {
									eventId: eventfullEventId,
									attendingStatus: "Co-Hosting",
									invitedBy: userId
								}
							}
						})
				)

				await Promise.all(addCoHostsPromises)
			}
		}

		return res.status(200).json({ message: "Event Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
