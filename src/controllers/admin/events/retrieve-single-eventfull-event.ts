import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response } from "express"
import findEvent from "../../../utils/find/find-event"

export default async function retrieveSingleEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventId as string
		const foundEvent = await findEvent(eventId as unknown as Types.ObjectId)
		if (_.isNull(foundEvent)) return res.status(400).json({ message: "Event not found" })

		const event = foundEvent.toObject() as EventfullEvent

		if (event.isActive !== true) {
			return res.status(400).json({ message: "Event not found" })
		}
		event.eventImages = event.eventImages.filter(image => image.isActive === true)

		return res.status(200).json({ event })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Single Event" })
	}
}
