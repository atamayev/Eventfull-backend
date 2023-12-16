import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import convertToEventfullEvent from "../../utils/events/convert-to-eventfull-event"

// eslint-disable-next-line max-lines-per-function
export default async function createEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent

		const convertedEvent = convertToEventfullEvent(eventfullEventData, userId)

		const newEvent = await EventfullEventModel.create({
			...convertedEvent,
			organizerId: userId,
			isActive: true
		})

		const eventId = newEvent._id
		await UserModel.updateOne(
			{ _id: userId},
			{
				$push: {
					eventfullEvents: {
						eventId,
						attendingStatus: "Hosting",
						invitedBy: userId
					}
				}
			}
		)

		if (!_.isUndefined(convertedEvent.coHosts)) {
			await Promise.all(convertedEvent.coHosts.map(coHostId =>
				UserModel.updateOne(
					{ _id: coHostId},
					{
						$push: {
							eventfullEvents: {
								eventId: eventId,
								attendingStatus: "Co-Hosting",
								invitedBy: userId
							}
						}
					}
				)
			))
		}

		if (!_.isUndefined(convertedEvent.invitees)) {
			await Promise.all(convertedEvent.invitees.map(invitee =>
				UserModel.updateOne(
					{ _id: invitee.userId},
					{
						$push: {
							eventfullEvents: {
								eventId: eventId,
								attendingStatus: "Not Responded",
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
