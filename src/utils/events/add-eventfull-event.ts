import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

// This is stupidly designed, using a spread operator is much better, but it doesn't work.
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
		eventCapacity: eventfullEvent.eventCapacity || null,

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
	})

	return newEvent._id
}

// TODO: Something like this is ideal:

// const newEvent = await EventfullEventModel.create({
// 	...convertedEvent,
// 	organizer: {
// 	userId: user._id,
// 	username: user.username,
// },
// 	isActive: true
// })
