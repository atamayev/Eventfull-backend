import { Request, Response, NextFunction } from "express"

export default function validateChangePasswordRequest(req: Request, res: Response, next: NextFunction): void | Response {
	if (!req.body || typeof req.body !== "object") {
		return res.status(400).json({ error: "Bad Request: Missing or invalid body" })
	}

	const changePasswordInfo = req.body.changePasswordObject

	if (!changePasswordInfo) {
		return res.status(400).json({ error: "Missing required fields" })
	}

	if (!changePasswordInfo.email || !changePasswordInfo.currentPassword || !changePasswordInfo.newPassword) {
		return res.status(400).json({ error: "Incomplete Change Password Information" })
	}

	next()
}
