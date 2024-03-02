import { Response, Request } from "express"

export default function getOnlyShowEventfullEvents (req: Request, res: Response): Response {
	try {
		const user = req.user

		return res.status(200).json({ onlyShowEventfullEvents: user.onlyShowEventfullEvents })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve onlyShowEventfullEvents" })
	}
}
