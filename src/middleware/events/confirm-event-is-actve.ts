import { Request, Response, NextFunction } from "express"

export default function confirmEventIsActive(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const event = req.event

		if (event.isActive === false) {
			return res.status(403).json({ error: "Event has been deleted." })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
