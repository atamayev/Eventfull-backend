import { Request, Response, NextFunction } from "express"

export default function validateGetGoogleCalendarUrlRequest (req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.headers.authorization ) {
		return res.status(400).json({ error: "Bad Request: Missing Authorization header" })
	}

	next()
}
