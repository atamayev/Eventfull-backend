import { Types } from "mongoose"
import { Request, Response } from "express"
import findEventCategory from "../../../../utils/find/find-event-category"

export default async function retrieveSingleEventCategory(req: Request, res: Response): Promise<Response> {
	try {
		const eventId = req.params.eventCategoryId as string
		const eventCategory = await findEventCategory(eventId as unknown as Types.ObjectId)

		if (eventCategory?.isActive !== true) {
			return res.status(400).json({ message: "Event Category not found" })
		}

		return res.status(200).json({ eventCategory })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Event Category" })
	}
}
