import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response } from "express"
import findEvent from "../../../utils/find/find-event"
import EventTypeModel from "../../../models/event-type-model"

export default async function retrieveSingleEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventId as string
		const foundEvent = await findEvent(eventId as unknown as Types.ObjectId)
		if (_.isNull(foundEvent)) {
			return res.status(400).json({ message: "Event not found" })
		}
		const leanEvent = foundEvent.toObject() as EventfullEvent

		if (leanEvent.isActive !== true) {
			return res.status(400).json({ message: "Event not found" })
		}
		leanEvent.eventImages = leanEvent.eventImages.filter(image => image.isActive === true)
		const eventTypeDoc = await EventTypeModel.findById(leanEvent.eventType).lean()

		if (_.isNull(eventTypeDoc)) {
			return res.status(500).json({ message: "Internal Server Error: Unable to Retrieve Single Event (eventTypeName is null)" })
		}

		const event: OutgoingEventfullEvent = {
			...leanEvent,
			eventType: {
				eventTypeId: leanEvent.eventType,
				eventTypeName: eventTypeDoc.eventTypeName
			}
		}

		return res.status(200).json({ event })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Single Event" })
	}
}
