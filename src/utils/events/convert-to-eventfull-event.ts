import EventfullEventModel from "../../models/eventfull-event-model"

export default function convertToEventfullEvent(
	incomingEvent: IncomingEventfullEvent,
	organizer: User,
	friendIds: string[]
): EventfullEvent {
	const event = new EventfullEventModel ({
		...incomingEvent,
		invitees: incomingEvent.invitees
			.filter(invitee => friendIds.includes(invitee.userId.toString()))
			.map(invitee => ({
				user: {
					userId: invitee.userId,
					username: invitee.username,
				},
				attendingStatus: "Not Responded",
				invitedBy: {
					userId: organizer._id,
					username: organizer.username,
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
				}
			}),
		),
		attendees: []
	})
	return event
}
