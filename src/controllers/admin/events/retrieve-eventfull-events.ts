import _ from "lodash"
import { Request, Response } from "express"
import EventTypeModel from "../../../models/event-type-model"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function retrieveEventfullEvents(req: Request, res: Response): Promise<Response> {
	try {
		// TODO: Down the line, will need to add pagination
		const foundEvents = await EventfullEventModel.find({ isActive: true }).lean()

		const eventsWithTypes = await Promise.all(foundEvents.map(async (foundEvent) => {
			const eventTypeDoc = await EventTypeModel.findById(foundEvent.eventType).lean()

			if (_.isNull(eventTypeDoc)) {
				console.error(`EventType not found for event ${foundEvent._id}`)
				return null // Example: Skip events with missing eventType
			}

			return {
				...foundEvent,
				eventType: {
					eventTypeId: foundEvent.eventType,
					eventTypeName: eventTypeDoc.eventTypeName
				}
			}
		}))

		// Filter out null values if some events were skipped
		const filteredEvents = eventsWithTypes.filter(event => event !== null)

		return res.status(200).json({ events: filteredEvents })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve events" })
	}
}
