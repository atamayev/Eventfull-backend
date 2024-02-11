/* eslint-disable max-len */
import EventfullEventModel from "../../models/eventfull-event-model"

export default function convertAdminEventToEventfullEvent(
	admin: Admin,
	adminEvent: IncomingEventfullEvent,
): EventfullEvent {
	const event = {
		eventName: adminEvent.eventName,
		eventPrice: adminEvent.eventPrice,
		eventType: adminEvent.eventType,
		isVirtual: false,
		isActive: true,
		eventPublic: true,
		eventReviewable: false,
		canInvitedUsersInviteOthers: true,
		eventFrequency: adminEvent.eventFrequency,

		invitees: [],
		coHosts: [],
		attendees: [],
		eventCapacity: null,

		eventURL: adminEvent.eventURL,
		eventDescription: adminEvent.eventDescription,
		address: adminEvent.address,
		createdBy: {
			userId: admin._id,
			username: admin.username,
			isCreatedByAdmin: true,
			createdAt: new Date(),
		},
		...(adminEvent.eventFrequency === "one-time" && adminEvent.singularEventTime ? { singularEventTime: adminEvent.singularEventTime } : {}),
		...(adminEvent.eventFrequency === "custom" && adminEvent.customEventDates ? { customEventDates: adminEvent.customEventDates } : {}),
		...(adminEvent.eventFrequency === "ongoing" && adminEvent.ongoingEventTimes ? { ongoingEventTimes: adminEvent.ongoingEventTimes } : {}),
	}

	return new EventfullEventModel(event)
}
