import { Request, Response, NextFunction } from "express"

export default function confirmEventIsNotPinned(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const event = req.event

		const isEventPinned = user.eventPins.includes(event._id)

		if (isEventPinned === true) {
			return res.status(400).json({ message: "Event is already pinned." })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify if Event is Already Pinned" })
	}
}
