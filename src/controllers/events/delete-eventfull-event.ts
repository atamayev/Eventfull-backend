import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function deleteEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventfullEventId = req.body.eventfullEventId as string
		const eventfullEvent = await EventfullEventModel.findById(eventfullEventId)
		if (_.isNull(eventfullEvent)) return res.status(404).json({ error: "Event not found" })

		await EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{ $set: { isActive: false } },
			{ new: true, runValidators: true }
		)

		return res.status(200).json({ message: "Event Deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
