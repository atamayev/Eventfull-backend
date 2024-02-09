import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function deleteAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventId as string

		await EventfullEventModel.findByIdAndUpdate(
			eventId,
			{ isActive: false }
		)
		return res.status(200).json({ success: "Event deleted successfully"})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Event" })
	}
}
