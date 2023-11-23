import { Request, Response, NextFunction } from "express"

export default function validateRegisterRequestBody (req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.body || typeof req.body !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid body" })
	}

	const registerInfo = req.body.registerInformationObject
	if (!registerInfo || typeof registerInfo !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid Register Information" })
	}

	const { email, password } = registerInfo as LoginInformationObject
	if (!email || !password) {
		return res.status(400).json({ error: "Bad Request: Missing required fields" })
	}

	next()
}
