/* eslint-disable max-len */
import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function addEventfullEvent(eventfullEvent: EventfullEvent, user: User): Promise<Types.ObjectId> {
	const newEvent = await EventfullEventModel.create({
		eventName: eventfullEvent.eventName,
		eventPrice: eventfullEvent.eventPrice,
		eventType: eventfullEvent.eventType,
		isVirtual: eventfullEvent.isVirtual,
		isActive: eventfullEvent.isActive,
		eventPublic: eventfullEvent.eventPublic,
		eventReviewable: eventfullEvent.eventReviewable,
		canInvitedUsersInviteOthers: eventfullEvent.canInvitedUsersInviteOthers,
		eventFrequency: eventfullEvent.eventFrequency,
		address: eventfullEvent.address,
		eventDescription: eventfullEvent.eventDescription,

		invitees: eventfullEvent.invitees,
		coHosts: eventfullEvent.coHosts,
		attendees: eventfullEvent.attendees,
		eventCapacity: eventfullEvent.eventCapacity,

		createdBy: {
			userId: user._id,
			username: user.username,
		},
		organizer: {
			userId: user._id,
			username: user.username,
		},

		eventURL: eventfullEvent.eventURL,
		extraEventCategories: eventfullEvent.extraEventCategories,
		eventImageURL: eventfullEvent.eventImageURL,

		...(eventfullEvent.eventFrequency === "one-time" && eventfullEvent.singularEventTime ? { singularEventTime: eventfullEvent.singularEventTime } : {}),
		...(eventfullEvent.eventFrequency === "custom" && eventfullEvent.customEventDates ? { customEventDates: eventfullEvent.customEventDates } : {}),
		...(eventfullEvent.eventFrequency === "ongoing" && eventfullEvent.ongoingEventTimes ? { ongoingEventTimes: eventfullEvent.ongoingEventTimes } : {}),
	})

	return newEvent._id
}
