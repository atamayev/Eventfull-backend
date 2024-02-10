import { Request, Response } from "express"
import EventTypeModel from "../../../../models/event-type-model"
import EventCategoryModel from "../../../../models/event-category-model"

export default async function updateEventCategory(req: Request, res: Response): Promise<Response> {
	try {
		const incomingEventCategory = req.body.eventCategoryDetails as EventCategory

		await EventCategoryModel.findByIdAndUpdate(
			incomingEventCategory._id,
			incomingEventCategory
		)
		const { _id: categoryId, eventCategoryName, description } = incomingEventCategory

		const eventTypesToUpdate = await EventTypeModel.find({ "categories.categoryId": categoryId }).lean()

		for (const eventType of eventTypesToUpdate) {
			const updatedCategories = eventType.categories.map(category => {
				if (category.categoryId.toString() === categoryId.toString()) {
					return { ...category, eventCategoryName, description }
				}
				return category
			})

			await EventTypeModel.findByIdAndUpdate(eventType._id, { $set: { categories: updatedCategories } })
		}

		return res.status(200).json({ success: "Event Category updated successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Event Category" })
	}
}
