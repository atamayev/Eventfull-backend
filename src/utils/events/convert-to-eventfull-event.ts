import { Types } from "mongoose"

export default function convertToEventfullEvent(incomingEvent: IncomingEventfullEvent, organizerId: Types.ObjectId): EventfullEvent {
	const event: EventfullEvent = {
		...incomingEvent,
		invitees: incomingEvent.invitees.map(inviteeId => ({
			userId: inviteeId,
			attendingStatus: "Not Responded",
			invitedBy: organizerId,
		}))
	}

	return event
}