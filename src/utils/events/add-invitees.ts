import { Types } from "mongoose"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function addInvitees(
	userId: Types.ObjectId,
	eventfullEventId: Types.ObjectId,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent
): Promise<void> {
	const user = await UserModel.findById(userId).select("friends")
	const friendIds = user?.friends.map(friend => friend.toString()) || []

	const updatedInviteeIds = updatedEventData.invitees.map(invitee => invitee.toString())

	const inviteesToAdd = updatedEventData.invitees
		.filter(inviteeId => friendIds.includes(inviteeId.toString()))
		.filter(inviteeId => !currentEvent.invitees.some(existingInvitee =>
			existingInvitee.userId.toString() === inviteeId.toString()))
		.filter(inviteeId => !currentEvent.attendees.some(existingAttendee =>
			existingAttendee.userId.toString() === inviteeId.toString()))
		.map(inviteeId => ({
			userId: inviteeId,
			attendingStatus: "Not Responded",
			invitedBy: userId
		}))

	const inviteesToRemove = currentEvent.invitees.filter(existingInvitee =>
		!updatedInviteeIds.includes(existingInvitee.userId.toString()) &&
    existingInvitee.attendingStatus === "Not Responded")

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { invitees, coHosts, ...eventDataToUpdate } = updatedEventData

	const deleteInviteesPromise = EventfullEventModel.findByIdAndUpdate(
		eventfullEventId,
		{ $pull: { invitees: { userId: { $in: inviteesToRemove.map(invitee => invitee.userId) } } } },
		{ new: true, runValidators: true }
	)

	const removeInviteesPromises = inviteesToRemove.map(invitee =>
		UserModel.updateOne(
			{ _id: invitee.userId },
			{ $pull: { eventfullEvents: { eventId: eventfullEventId } } }
		)
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

	await Promise.all([
		deleteInviteesPromise,
		addInviteesPromise,
		...addInviteesPromises,
		...removeInviteesPromises
	])
}
