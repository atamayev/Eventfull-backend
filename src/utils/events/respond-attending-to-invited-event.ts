import EventfullEventModel from "../../models/eventfull-event-model"

export default async function respondAttendingToInvitedEvent(
	user: User,
	event: EventfullEvent,
	invitedBy: SocialData
): Promise<void> {
	// First, remove the user from the invitees array
	const pullInviteePromise = EventfullEventModel.findByIdAndUpdate(
		event._id,
		{ $pull: { invitees: { "user.userId": user._id } } }, // Adjust the path to match your schema
		{ runValidators: true }
	)

	// Then, add the user to the attendees array

	const pushAttendeePromise = EventfullEventModel.findByIdAndUpdate(
		event._id,
		{
			$push: {
				attendees: {
					user: {
						userId: user._id,
						username: user.username,
					},
					invitedBy: {
						userId: invitedBy.userId,
						username: invitedBy.username,
					}
				}
			}
		},
		{ runValidators: true }
	)

	await Promise.all([pullInviteePromise, pushAttendeePromise])
}
