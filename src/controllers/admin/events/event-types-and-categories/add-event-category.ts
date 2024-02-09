import { Request, Response } from "express"
import EventCategoryModel from "../../../../models/event-category-model"

export default async function addEventCategory(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const incomingEventCategory = req.body.eventCategoryDetails as IncomingEventCategory

		const eventCategory = await EventCategoryModel.create({
			...incomingEventCategory,
			createdBy: {
				adminId: admin._id,
				username: admin.username,
				createdAt: new Date(),
			}
		})

		return res.status(200).json({ eventCategory })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event Category" })
	}
}
