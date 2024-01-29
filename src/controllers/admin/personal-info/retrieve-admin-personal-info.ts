import { Request, Response } from "express"

export default function retrieveAdminPersonalInfo (req: Request, res: Response): Response {
	try {
		const admin = req.admin

		const personalInfo = {
			firstName: admin.firstName,
			lastName: admin.lastName,
			username: admin.username,
			email: admin.email,
		}
		return res.status(200).json({ personalInfo })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Logout" })
	}
}
