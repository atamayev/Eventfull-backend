import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function retrieveEventfullEvents(req: Request, res: Response): Promise<Response> {
	try {
		const events = await EventfullEventModel.find().lean()

		return res.status(200).json({ events })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
