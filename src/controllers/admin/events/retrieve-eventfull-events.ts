import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function retrieveEventfullEvents(req: Request, res: Response): Promise<Response> {
	try {
		// TODO: Down the line, will need to add pagination
		const events = await EventfullEventModel.find(
			{ isActive: true }
		).lean()

		return res.status(200).json({ events })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve events" })
	}
}
