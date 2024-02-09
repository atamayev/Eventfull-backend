import { Request, Response } from "express"
import EventTypeModel from "../../../../models/event-type-model"

export default async function deleteEventType(req: Request, res: Response): Promise<Response> {
	try {
		const eventTypeId = req.params.eventTypeId as string

		await EventTypeModel.findByIdAndUpdate(
			eventTypeId,
			{ isActive: false }
		)

		return res.status(200).json({ success: "Event type deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Event Type" })
	}
}
