import { Request, Response } from "express"

export default function adminLogout (req: Request, res: Response): Response {
	// Down the line, consider adding a logout history record
	// Consider adding signing a UUID as the JWT, and then storing that UUID in a collection, each linked to a userID
	// Then, when the user logs out, delete that UUID from the database
	try {
		return res.status(200).json({ success: "Logout successful" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Logout" })
	}
}
