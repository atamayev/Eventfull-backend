import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"
import UserModel from "../../models/user-model"

// eslint-disable-next-line max-lines-per-function
export default async function addInvitees(
	userId: Types.ObjectId,
	eventfullEventId: string,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent
): Promise<void> {
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
}
