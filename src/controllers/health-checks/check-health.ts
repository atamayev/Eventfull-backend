import { Request, Response } from "express"

export default function checkHealth(req: Request, res: Response): Response {
	return res.status(200).send("OK")
}
