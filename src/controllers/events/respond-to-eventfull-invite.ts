import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import respondAttendingToInvitedEvent from "../../utils/events/respond-attending-to-invited-event"

export default async function respondToEventfullInvite(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const { response, eventfullEventId } = req.body

		if (response === "Not Attending") {
			await EventfullEventModel.findOneAndUpdate(
				{ _id: eventfullEventId, "invitees.userId": userId },
				{ $set: { "invitees.$.attendingStatus": response } },
				{ new: true, runValidators: true }
			)
		} else if (response === "Attending") {
			await respondAttendingToInvitedEvent(userId, eventfullEventId)
		}

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId, "eventfullEvents.eventId": eventfullEventId },
			{ $set: { "eventfullEvents.$.attendingStatus": response } },
			{ new: true, runValidators: true }
		)

		if (_.isNull(updatedUser)) return res.status(400).json({ error: "User not found" })

		if (response === "Attending") {
			return res.status(200).json({ message: "Accepted Event Invite" })
		} else if (response === "Not Attending") {
			return res.status(200).json({ message: "Declined Event Invite" })
		} else if (response === "Not Responded") {
			return res.status(200).json({ message: "Unresponded to Event Invite" })
		} else {
			return res.status(200).json({ message: "Responded to Event Invite" })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
