import dayjs from "dayjs"
import EventfullEventModel from "../../models/eventfull-event-model"

export default function convertAdminEventToEventfullEvent(
	admin: Admin,
	adminEvent: NewAdminEventfullEvent,
): EventfullEvent {
	const startTime = dayjs(adminEvent.eventTime)
	const endTime = startTime.add(adminEvent.eventDuration.hours, "hour").add(adminEvent.eventDuration.minutes, "minute")

	const event = {
		eventName: adminEvent.eventName,
		eventPrice: adminEvent.eventPrice,
		eventType: "Entertainment",
		isVirtual: false,
		eventPublic: true,
		coHosts: [],
		isActive: true,
		eventReviewable: false,
		canInvitedUsersInviteOthers: true,
		invitees: [],
		attendees: [],
		eventCapacity: null,
		eventDuration: adminEvent.eventDuration,

		eventStartTime: startTime.toDate(),
		eventEndTime: endTime.toDate(),

		eventURL: adminEvent.eventURL,
		eventDescription: adminEvent.eventDescription,
		address: adminEvent.address,
		createdBy: {
			userId: admin._id,
			username: admin.username,
			isCreatedByAdmin: true,
			createdAt: new Date(),
		},
	}

	return new EventfullEventModel(event)
}
