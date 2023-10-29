import { Request, Response, NextFunction } from "express"

export default function validateRegisterRequestBody (req: Request, res: Response, next: NextFunction): void| Response {
	if (!req.body || typeof req.body !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid body" })
	}

	const loginInfo = req.body.registerInformationObject
	if (!loginInfo || typeof loginInfo !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid Register Information" })
	}

	const { email, password } = loginInfo
	if (!email || !password) {
		return res.status(400).json({ error: "Bad Request: Missing required fields" })
	}

	next()
}
