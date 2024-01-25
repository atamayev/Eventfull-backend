import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

// This is stupidly designed, using a spread operator is much better, but it doesn't work.
export default async function addEventfullEvent(eventfullEvent: EventfullEvent, user: User): Promise<Types.ObjectId> {
	const newEvent = await EventfullEventModel.create({
		eventName: eventfullEvent.eventName,
		eventTimeStart: eventfullEvent.eventTimeStart,
		eventTimeEnd: eventfullEvent.eventTimeEnd,
		eventPrice: eventfullEvent.eventPrice,
		isVirtual: eventfullEvent.isVirtual,
		eventPublic: eventfullEvent.eventPublic,
		organizer: {
			userId: user._id,
			username: user.username,
		},
		coHosts: eventfullEvent.coHosts,
		isActive: true,
		eventReviewable: eventfullEvent.eventReviewable,
		canInvitedUsersInviteOthers: eventfullEvent.canInvitedUsersInviteOthers,
		invitees: eventfullEvent.invitees,
		attendees: eventfullEvent.attendees,
		eventCapacity: eventfullEvent.eventCapacity || null,

		eventURL: eventfullEvent.eventURL,
		eventImageURL: eventfullEvent.eventImageURL,
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
// 	organizer: {
// 	userId: user._id,
// 	username: user.username,
// },
// 	isActive: true
// })
