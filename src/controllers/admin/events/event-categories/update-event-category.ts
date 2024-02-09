import { Request, Response } from "express"
import EventCategoryModel from "../../../../models/event-category-model"

export default async function updateEventCategory(req: Request, res: Response): Promise<Response> {
	try {
		const incomingEventCategory = req.body.eventCategoryDetails as EventCategory

		await EventCategoryModel.findByIdAndUpdate(
			incomingEventCategory._id,
			incomingEventCategory
		)

		return res.status(200).json({ success: "Event Category updated successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Event Category" })
	}
}
