import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import respondAttendingToInvitedEvent from "../../utils/events/respond-attending-to-invited-event"

// eslint-disable-next-line complexity
export default async function respondToEventfullInvite(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { response } = req.body
		const event = req.event

		if (response === "Not Attending" || response === "Not Responded") {
			await EventfullEventModel.findOneAndUpdate(
				{ _id: event._id, "invitees.userId": user._id },
				{ $set: { "invitees.$.attendingStatus": response } },
				{ runValidators: true }
			)
		} else if (response === "Attending") {
			const invitee = event.invitees.find(inv => _.isEqual(inv.user.userId, user._id))

			const invitedBy = invitee ? invitee.invitedBy : null
			if (_.isNull(invitedBy)) {
				return res.status(400).json({ message: "Invite not found" })
			}
			await respondAttendingToInvitedEvent(user, event, invitedBy)
		}

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: user._id, "eventfullEvents.eventId": event._id },
			{ $set: { "eventfullEvents.$.attendingStatus": response } },
			{ new: true, runValidators: true }
		)

		if (_.isNull(updatedUser)) return res.status(400).json({ message: "User not found" })

		if (response === "Attending") {
			return res.status(200).json({ success: "Accepted Event Invite" })
		} else if (response === "Not Attending") {
			return res.status(200).json({ success: "Declined Event Invite" })
		} else if (response === "Not Responded") {
			return res.status(200).json({ success: "Unresponded to Event Invite" })
		} else {
			return res.status(200).json({ success: "Responded to Event Invite" })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Respond to Eventfull Event" })
	}
}
