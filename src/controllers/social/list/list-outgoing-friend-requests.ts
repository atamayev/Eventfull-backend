import { Request, Response } from "express"

export default function listOutgoingFriendRequests (req: Request, res: Response): Response {
	try {
		const user = req.user

		return res.status(200).json({ outgoingFriendRequests: user.outgoingFriendRequests })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Outgoing Friend Requests" })
	}
}
