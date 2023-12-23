import { Request, Response } from "express"

export default function logout (req: Request, res: Response): Response {
	// Down the line, consider adding a logout history record
	// Consider adding signing a UUID as the JWT, and then storing that UUID in a collection, each linked to a userID
	// Then, when the user logs out, delete that UUID from the database
	try {
		return res.status(200).json({ message: "Logout successful" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Problem with logout" })
	}
}
