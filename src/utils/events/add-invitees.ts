import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function addInvitees(
	user: User,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent,
	createdAt: Date
): Promise<void> {
	const friendIds = user.friends.map(friend => friend.userId.toString())

	const updatedInviteeIds = updatedEventData.invitees.map(invitee => invitee.userId.toString())

	const inviteesToAdd: EventfullInvitee[] = updatedEventData.invitees
		.filter(invitee => friendIds.includes(invitee.userId.toString()))
		.filter(invitee => !currentEvent.invitees.some(existingInvitee =>
			existingInvitee.user.userId.toString() === invitee.userId.toString()))
		.filter(invitee => !currentEvent.attendees.some(existingAttendee =>
			existingAttendee.user.userId.toString() === invitee.userId.toString()))
		.map(invitee => ({
			user: {
				userId: invitee.userId,
				username: invitee.username,
			},
			attendingStatus: "Not Responded",
			invitedBy: {
				userId: user._id,
				username: user.username || "User",
				createdAt,
			}
		}))

	const inviteesToRemove = currentEvent.invitees.filter(existingInvitee =>
		!updatedInviteeIds.includes(existingInvitee.user.userId.toString()) &&
    existingInvitee.attendingStatus === "Not Responded")

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { invitees, coHosts, ...eventDataToUpdate } = updatedEventData

	const deleteInviteesPromise = EventfullEventModel.findByIdAndUpdate(
		currentEvent._id,
		{ $pull: { invitees: { "user.userId":
			{
				$in: inviteesToRemove.map(invitee => invitee.user.userId)
			}
		} } },
		{ runValidators: true }
	)

	const removeInviteesPromises = inviteesToRemove.map(invitee =>
		UserModel.findByIdAndUpdate(
			invitee.user.userId,
			{ $pull: { eventfullEvents: { eventId: currentEvent._id } } },
			{ runValidators: true }
		)
	)

	const addInviteesPromise = EventfullEventModel.findByIdAndUpdate(
		currentEvent._id,
		{
			$set: eventDataToUpdate,
			$push: { invitees: { $each: inviteesToAdd } }
		},
		{ runValidators: true }
	)

	const addInviteesPromises = inviteesToAdd.map(invitee =>
		UserModel.findByIdAndUpdate(
			invitee.user.userId,
			{
				$push: {
					eventfullEvents: {
						eventId: currentEvent._id,
						attendingStatus: "Not Responded",
						invitedBy: {
							userId: user._id,
							username: user.username,
						}
					}
				}
			},
			{ runValidators: true }
		)
	)

	await Promise.all([
		deleteInviteesPromise,
		addInviteesPromise,
		...addInviteesPromises,
		...removeInviteesPromises
	])
}
