import { Request, Response, NextFunction } from "express"

export default function confirmEventIsPublic(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const event = req.event

		if (event.eventPublic === false) {
			return res.status(403).json({ error: "Event is not public." })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Internal Server Error: Unable to Verify if Event is Public" })
	}
}
