import { Request, Response } from "express"

export default function listFriends (req: Request, res: Response): Response {
	try {
		const user = req.user

		return res.status(200).json({ friends: user.friends })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Friends" })
	}
}
