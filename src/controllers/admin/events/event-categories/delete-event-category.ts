import { Request, Response } from "express"
import EventCategoryModel from "../../../../models/event-category-model"

export default async function deleteEventCategory(req: Request, res: Response): Promise<Response> {
	try {
		const eventCategoryId = req.params.eventCategoryId as string

		await EventCategoryModel.findByIdAndUpdate(
			eventCategoryId,
			{ isActive: false }
		)

		return res.status(200).json({ success: "Event category deleted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Delete Event Category" })
	}
}
