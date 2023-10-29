import { Request, Response, NextFunction } from "express"

export default function validateLoginRequestBody (req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.body || typeof req.body !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid body" })
	}

	const loginInfo = req.body.loginInformationObject

	if (!loginInfo || typeof loginInfo !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid Login Information" })
	}

	const { email, password } = loginInfo as LoginInformationObject
	if (!email || !password) {
		return res.status(400).json({ error: "Bad Request: Missing required fields" })
	}

	next()
}
