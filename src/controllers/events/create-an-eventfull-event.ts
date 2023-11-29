import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function createAnEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventData = req.body.eventfullEventData as EventfullEvent

		await EventfullEventModel.create({
			...eventfullEventData,
			organizerId: userId
		})

		return res.status(200).json({ message: "Event Created" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
