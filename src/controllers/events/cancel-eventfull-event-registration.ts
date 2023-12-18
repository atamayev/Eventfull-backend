import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import cancelEventRegistration from "../../utils/events/cancel-event-registration"

export default async function cancelEventfullEventRegistration(req: Request, res: Response): Promise<Response> {
	try {
		const isUserAttendingEvent = req.isUserAttendingEvent
		if (isUserAttendingEvent === false) {
			return res.status(200).json({ message: "User is not attending event" })
		}
		const userId = req.userId
		const event = req.event

		if (_.isEqual(event.organizerId, userId)) return res.status(200).json({ message: "You are the event organizer" })

		const user = await UserModel.findById(userId)
		if (_.isNull(user)) return res.status(404).json({ error: "User not found" })

		const eventIndex = user.eventfullEvents.findIndex(event1 => event1.eventId.toString() === event._id.toString())
		await cancelEventRegistration(userId, event._id, eventIndex)

		await EventfullEventModel.updateOne(
			{ _id: event._id },
			{ $pull: {
				attendees: { userId	}
			}}
		)

		return res.status(200).json({ message: "Cancelled Event Registration" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
