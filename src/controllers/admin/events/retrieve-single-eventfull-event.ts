import { Types } from "mongoose"
import { Request, Response } from "express"
import findEvent from "../../../utils/find/find-event"

export default async function retrieveSingleEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventId as string
		const event = await findEvent(eventId as unknown as Types.ObjectId)

		if (event?.isActive !== true) {
			return res.status(400).json({ message: "Event not found" })
		}

		return res.status(200).json({ event })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
