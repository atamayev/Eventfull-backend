import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function updateAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventfullEventData = req.body.eventfullEventData as EventfullEvent
		delete eventfullEventData.__v

		const updatedEvent = await EventfullEventModel.findByIdAndUpdate(
			eventfullEventData._id,
			eventfullEventData,
			{ new: true }
		)

		if (!_.isUndefined(updatedEvent?.createdBy?.userId)) {
			updatedEvent.createdBy.userId = updatedEvent.createdBy.userId.toString()
		}

		return res.status(200).json({ updatedEvent })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
