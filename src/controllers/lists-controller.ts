import { Request, Response } from "express"
import EventCategoryModel from "../models/event-category-model"
import EventTypeModel from "../models/event-type-model"

export async function getEventCategories (req: Request, res: Response): Promise<Response> {
	try {
		const response = await EventCategoryModel.find()
		return res.status(200).json(response)
	} catch (error) {
		console.error(error)
		return res.status(400).json([])
	}
}

export async function getEventTypes (req: Request, res: Response): Promise<Response> {
	try {
		const response = await EventTypeModel.find()
		return res.status(200).json(response)
	} catch (error) {
		console.error(error)
		return res.status(400).json([])
	}
}
