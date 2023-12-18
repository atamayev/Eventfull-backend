import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"
import convertToEventfullEvent from "../../utils/events/convert-to-eventfull-event"

// eslint-disable-next-line max-lines-per-function
export default async function createEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent

		const friendIds = user.friends.map(friend => friend.toString())
		const convertedEvent = convertToEventfullEvent(eventfullEventData, user._id, friendIds)

		const newEvent = await EventfullEventModel.create({
			...convertedEvent,
			organizerId: user._id,
			isActive: true
		})

		const eventId = newEvent._id
		await UserModel.updateOne(
			{ _id: user._id},
			{
				$push: {
					eventfullEvents: {
						eventId,
						attendingStatus: "Hosting"
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
								invitedBy: user._id
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
								invitedBy: user._id
							}
						}
					}
				)
			))
		}

		return res.status(200).json({ message: "Event Created", eventId: eventId.toString() })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
