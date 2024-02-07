import { Request, Response } from "express"
import EventCategoryModel from "../../models/event-category-model"

export default async function getEventCategories (req: Request, res: Response): Promise<Response> {
	try {
		const eventCategories = await EventCategoryModel.find()
		return res.status(200).json({ eventCategories })
	} catch (error) {
		console.error(error)
		return res.status(400).json([])
	}
}
