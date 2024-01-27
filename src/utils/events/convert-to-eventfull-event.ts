import _ from "lodash"
import EventfullEventModel from "../../models/eventfull-event-model"

export default function convertToEventfullEvent(
	incomingEvent: IncomingEventfullEvent,
	organizer: User,
	createdAt: Date,
): EventfullEvent {
	const friendIds = organizer.friends.map(friend => friend.userId)

	const event = new EventfullEventModel ({
		...incomingEvent,
		invitees: incomingEvent.invitees
			.filter(invitee => _.some(friendIds, (friendId) => friendId.equals(invitee.userId)))
			.map(invitee => ({
				user: {
					userId: invitee.userId,
					username: invitee.username,
				},
				attendingStatus: "Not Responded",
				invitedBy: {
					userId: organizer._id,
					username: organizer.username,
					createdAt,
				},
			})),
		coHosts: incomingEvent.coHosts.map(
			coHost => ({
				user: {
					userId: coHost.userId,
					username: coHost.username,
				},
				invitedBy: {
					userId: organizer._id,
					username: organizer.username,
					createdAt,
				}
			}),
		),
		attendees: []
	})
	return event
}
