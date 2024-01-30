import { Request, Response, NextFunction } from "express"

export default function confirmEventIsPinned(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const eventfullEventId = req.body.eventfullEventId

		const isEventPinned = user.eventPins.includes(eventfullEventId)

		if (isEventPinned === false) {
			return res.status(400).json({ message: "Event is not pinned." })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify if Event is Pinned" })
	}
}