import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

// This is stupidly designed, using a spread operator is much better, but it doesn't work.
export default async function addEventfullEvent(eventfullEvent: EventfullEvent, userId: Types.ObjectId): Promise<Types.ObjectId> {
	const newEvent = await EventfullEventModel.create({
		eventName: eventfullEvent.eventName,
		eventTimeStart: eventfullEvent.eventTimeStart,
		eventTimeEnd: eventfullEvent.eventTimeEnd,
		eventPrice: eventfullEvent.eventPrice,
		isVirtual: eventfullEvent.isVirtual,
		eventPublic: eventfullEvent.eventPublic,
		organizerId: userId,
		coHosts: eventfullEvent.coHosts,
		isActive: true,
		eventReviewable: eventfullEvent.eventReviewable,
		canInvitedUsersInviteOthers: eventfullEvent.canInvitedUsersInviteOthers,
		invitees: eventfullEvent.invitees,
		attendees: eventfullEvent.attendees,

		eventURL: eventfullEvent.eventURL,
		eventImageURL: eventfullEvent.eventImageURL,
		eventCapacity: eventfullEvent.eventCapacity,
		extraEventCategories: eventfullEvent.extraEventCategories,
		eventDescription: eventfullEvent.eventDescription,
		eventLocation: eventfullEvent.eventLocation,
		eventType: eventfullEvent.eventType,
	})

	return newEvent._id
}

// Something like this is ideal:

// const newEvent = await EventfullEventModel.create({
// 	...convertedEvent,
// 	organizerId: user._id,
// 	isActive: true
// })
