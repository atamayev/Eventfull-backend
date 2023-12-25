import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"
import cancelEventRegistration from "../../utils/events/cancel-event-registration"

export default async function cancelEventfullEventRegistration(req: Request, res: Response): Promise<Response> {
	try {
		const isUserAttendingEvent = req.isUserAttendingEvent
		if (isUserAttendingEvent === false) {
			return res.status(400).json({ message: "User is not attending event" })
		}
		const user = req.user
		const event = req.event

		if (_.isEqual(event.organizerId, user._id)) return res.status(400).json({ message: "You are the event organizer" })

		const eventIndex = user.eventfullEvents.findIndex(event1 => event1.eventId.toString() === event._id.toString())
		await cancelEventRegistration(user._id, event._id, eventIndex)

		await EventfullEventModel.findByIdAndUpdate(
			event._id,
			{
				$pull: {
					attendees: { userId: user._id }
				}
			},
			{ runValidators: true }
		)

		return res.status(200).json({ success: "Cancelled Event Registration" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Cancel Eventfull Event Registration" })
	}
}
