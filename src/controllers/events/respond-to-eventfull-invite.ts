import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function respondToEventfullInvite(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const { response, eventfullEventId } = req.body

		const updatedEvent = await EventfullEventModel.findOneAndUpdate(
			{ _id: eventfullEventId, "invitees.userId": userId },
			{ $set: { "invitees.$.isAttending": response } },
			{ new: true, runValidators: true }
		)

		if (_.isNull(updatedEvent)) return res.status(400).json({ error: "Event not found" })

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId, "eventfullEvents.eventId": eventfullEventId },
			{ $set: { "eventfullEvents.$.isAttending": response } },
			{ new: true, runValidators: true }
		)

		if (_.isNull(updatedUser)) return res.status(400).json({ error: "User not found" })

		return res.status(200).json({ message: "Responded to Event Invite" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
