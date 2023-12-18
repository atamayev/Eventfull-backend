import _ from "lodash"
import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function respondAttendingToInvitedEvent(userId: Types.ObjectId, event: EventfullEvent): Promise<void> {
	const invitee = event.invitees.find(inv => _.isEqual(inv.userId, userId))

	const invitedById = invitee ? invitee.invitedBy : null

	if (_.isNull(invitedById)) throw new Error("User not invited to event")

	// First, remove the user from the invitees array
	await EventfullEventModel.findOneAndUpdate(
		{ _id: event._id },
		{ $pull: { invitees: { userId: userId } } },
		{ new: true, runValidators: true }
	)

	// Then, add the user to the attendees array
	await EventfullEventModel.findOneAndUpdate(
		{ _id: event._id },
		{ $push: { attendees: { userId: userId, invitedBy: invitedById } } },
		{ new: true, runValidators: true }
	)
}
