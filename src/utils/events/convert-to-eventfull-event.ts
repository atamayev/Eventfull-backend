import { Types } from "mongoose"

export default function convertToEventfullEvent(
	incomingEvent: IncomingEventfullEvent,
	organizerId: Types.ObjectId,
	friendIds: string[]
): EventfullEvent {
	const event: EventfullEvent = {
		...incomingEvent,
		invitees: incomingEvent.invitees
			.filter(inviteeId => friendIds.includes(inviteeId.toString()))
			.map(inviteeId => ({
				userId: inviteeId,
				attendingStatus: "Not Responded",
				invitedBy: organizerId,
			})),
		coHosts: incomingEvent.coHosts.map(
			coHostId => ({
				userId: coHostId,
				invitedBy: organizerId
			}),
		),
		attendees: []
	}
	return event
}
