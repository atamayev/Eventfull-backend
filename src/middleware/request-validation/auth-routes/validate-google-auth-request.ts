import { Request, Response, NextFunction } from "express"

export default function validateGoogleAuthRequest (req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.query || !req.query.code ) {
		return res.status(400).json({ error: "Bad Request: Missing or invalid body" })
	}

	next()
}
