/* eslint-disable max-len */
import _ from "lodash"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default function convertToEventfullEvent(
	incomingEvent: IncomingEventfullEvent,
	organizer: User,
	createdAt: Date,
): EventfullEvent {
	const friendIds = organizer.friends.map(friend => friend.userId)

	const event = new EventfullEventModel ({
		...incomingEvent,
		...(incomingEvent.eventFrequency === "one-time" && incomingEvent.singularEventTime ? { singularEventTime: incomingEvent.singularEventTime } : {}),
		...(incomingEvent.eventFrequency === "custom" && incomingEvent.customEventDates ? { customEventDates: incomingEvent.customEventDates } : {}),
		...(incomingEvent.eventFrequency === "ongoing" && incomingEvent.ongoingEventTimes ? { ongoingEventTimes: incomingEvent.ongoingEventTimes } : {}),

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
