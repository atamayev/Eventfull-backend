import _ from "lodash"
import { Request, Response } from "express"
import EventTypeModel from "../../../models/event-type-model"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function retrieveEventfullEvents(req: Request, res: Response): Promise<Response> {
	try {
		// TODO: Down the line, will need to add pagination
		const events = await EventfullEventModel.find({ isActive: true }).lean()

		const eventsWithTypes = await Promise.all(events.map(async (foundEvent) => {
			const eventTypeDoc = await EventTypeModel.findById(foundEvent.eventType).lean()

			if (_.isNull(eventTypeDoc)) return null

			return {
				...foundEvent,
				eventType: {
					eventTypeId: foundEvent.eventType,
					eventTypeName: eventTypeDoc.eventTypeName
				}
			}
		}))

		const filteredEvents = eventsWithTypes.filter(event => event !== null)

		return res.status(200).json({ events: filteredEvents })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve events" })
	}
}
