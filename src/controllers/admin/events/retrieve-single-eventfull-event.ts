import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function retrieveSingleEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventId as string
		const event = await EventfullEventModel.findById(eventId).lean()
		if (_.isNull(event)) return res.status(400).json({ message: "Event not found" })

		if (event.isActive !== true) return res.status(400).json({ message: "Event not found" })

		event.eventImages = event.eventImages.filter(image => image.isActive === true)

		return res.status(200).json({ event })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Single Event" })
	}
}
