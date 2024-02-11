import { Request, Response } from "express"
import EventTypeModel from "../../models/event-type-model"

export default async function getEventTypes (req: Request, res: Response): Promise<Response> {
	try {
		const eventTypes = await EventTypeModel.find(
			{ isActive: true }
		).lean()
		return res.status(200).json({ eventTypes })
	} catch (error) {
		console.error(error)
		return res.status(400).json([])
	}
}
