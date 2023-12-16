import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import convertToEventfullEvent from "../../utils/events/convert-to-eventfull-event"

export default async function createAnEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent

		const convertedEvent = convertToEventfullEvent(eventfullEventData, userId)

		const newEvent = await EventfullEventModel.create({
			...convertedEvent,
			organizerId: userId,
		})

		const eventId = newEvent._id
		if (!_.isUndefined(convertedEvent.invitees)) {
			await Promise.all(convertedEvent.invitees.map(invitee =>
				UserModel.updateOne(
					{ _id: invitee.userId},
					{
						$push: {
							eventfullEvents: {
								eventId: eventId,
								isAttending: "Not Responded",
								invitedBy: userId
							}
						}
					}
				)
			))
		}

		return res.status(200).json({ message: "Event Created" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
