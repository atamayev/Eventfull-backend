import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function deleteEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const event = req.event

		await EventfullEventModel.findByIdAndUpdate(
			event._id,
			{ $set: { isActive: false } },
			{ runValidators: true }
		)

		return res.status(200).json({ message: "Event Deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Eventfull Event" })
	}
}
