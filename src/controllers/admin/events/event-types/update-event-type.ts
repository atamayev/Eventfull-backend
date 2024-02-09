import { Request, Response } from "express"
import EventTypeModel from "../../../../models/event-type-model"

export default async function updateEventType(req: Request, res: Response): Promise<Response> {
	try {
		const incomingEventType = req.body.eventTypeDetails as EventType

		await EventTypeModel.findByIdAndUpdate(
			incomingEventType._id,
			incomingEventType
		)

		return res.status(200).json({ success: "Event Type updated successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Event Type" })
	}
}
