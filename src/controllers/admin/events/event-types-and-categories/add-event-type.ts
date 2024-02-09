import { Request, Response } from "express"
import EventTypeModel from "../../../../models/event-type-model"

export default async function addEventType(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const incomingEventType = req.body.eventTypeDetails as IncomingEventType

		const eventType = await EventTypeModel.create({
			...incomingEventType,
			createdBy: {
				adminId: admin._id,
				username: admin.username,
				createdAt: new Date(),
			}
		})

		return res.status(200).json({ eventType })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event Type" })
	}
}
