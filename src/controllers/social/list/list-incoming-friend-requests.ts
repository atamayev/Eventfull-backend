import { Request, Response } from "express"

export default function listIncomingFriendRequests (req: Request, res: Response): Response {
	try {
		const user = req.user

		return res.status(200).json({ incomingFriendRequests: user.incomingFriendRequests })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Incoming Friend Requests" })
	}
}
