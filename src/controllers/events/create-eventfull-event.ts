import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import convertToEventfullEvent from "../../utils/events/convert-to-eventfull-event"
import addEventfullEvent from "../../utils/events/add-eventfull-event"

// eslint-disable-next-line max-lines-per-function
export default async function createEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent

		const friendIds = user.friends.map(friend => friend.toString())
		const convertedEvent = convertToEventfullEvent(eventfullEventData, user._id, friendIds)

		const eventId = await addEventfullEvent(convertedEvent, user._id)
		await UserModel.findByIdAndUpdate(
			user._id,
			{
				$push: {
					eventfullEvents: {
						eventId,
						attendingStatus: "Hosting"
					}
				}
			},
			{ runValidators: true }
		)

		if (!_.isUndefined(convertedEvent.coHosts)) {
			await Promise.all(convertedEvent.coHosts.map(coHostId =>
				UserModel.findByIdAndUpdate(
					coHostId,
					{
						$push: {
							eventfullEvents: {
								eventId: eventId,
								attendingStatus: "Co-Hosting",
								invitedBy: user._id
							}
						}
					},
					{ runValidators: true }
				)
			))
		}

		if (!_.isUndefined(convertedEvent.invitees)) {
			await Promise.all(convertedEvent.invitees.map(invitee =>
				UserModel.findByIdAndUpdate(
					invitee.userId,
					{
						$push: {
							eventfullEvents: {
								eventId: eventId,
								attendingStatus: "Not Responded",
								invitedBy: user._id
							}
						}
					},
					{ runValidators: true }
				)
			))
		}

		return res.status(200).json({ message: "Event Created", eventId: eventId.toString() })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Eventfull Event" })
	}
}
