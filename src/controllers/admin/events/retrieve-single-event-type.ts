import { Types } from "mongoose"
import { Request, Response } from "express"
import findEventType from "../../../utils/find/find-event-type"

export default async function retrieveSingleEventType(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventTypeId as string
		const eventType = await findEventType(eventId as unknown as Types.ObjectId)

		if (eventType?.isActive !== true) {
			return res.status(400).json({ message: "Event Type not found" })
		}

		return res.status(200).json({ eventType })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Event Type" })
	}
}
