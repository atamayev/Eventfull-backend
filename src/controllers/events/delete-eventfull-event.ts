import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function deleteEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventfullEventId = req.body.eventfullEventId as string
		const eventfullEventIdObject = new Types.ObjectId(eventfullEventId)
		const eventfullEvent = await EventfullEventModel.findOne({ _id: eventfullEventIdObject })
		if (_.isNull(eventfullEvent)) return res.status(404).json({ error: "Event not found" })

		await EventfullEventModel.findByIdAndUpdate(
			eventfullEventIdObject,
			{ $set: { isActive: false } },
			{ new: true, runValidators: true }
		)

		return res.status(200).json({ message: "Event Deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
