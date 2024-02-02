import { Types } from "mongoose"
import { Request, Response } from "express"
import findEvent from "../../../utils/find/find-event"

export default async function retrieveSingleEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventId as string
		const eventIdObjectId = new Types.ObjectId(eventId)
		const event = await findEvent(eventIdObjectId)

		if (event?.isActive === false) {
			return res.status(404).json({ error: "Event not found" })
		}

		return res.status(200).json({ event })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
