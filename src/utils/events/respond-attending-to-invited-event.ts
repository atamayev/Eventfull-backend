import _ from "lodash"
import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function respondAttendingToInvitedEvent(userId: Types.ObjectId, event: EventfullEvent): Promise<void> {
	const invitee = event.invitees.find(inv => _.isEqual(inv.userId, userId))

	const invitedById = invitee ? invitee.invitedBy : null

	if (_.isNull(invitedById)) throw new Error("User not invited to event")

	// First, remove the user from the invitees array
	await EventfullEventModel.findByIdAndUpdate(
		event._id,
		{ $pull: { invitees: { userId: userId } } },
		{ runValidators: true }
	)

	// Then, add the user to the attendees array
	await EventfullEventModel.findByIdAndUpdate(
		event._id,
		{ $push: { attendees: { userId: userId, invitedBy: invitedById } } },
		{ runValidators: true }
	)
}
