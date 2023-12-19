import { Request, Response, NextFunction } from "express"
import emailOrPhone from "../../../utils/email-or-phone"

export default function determineChangePasswordContactType (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const contact = req.body.changePasswordObject.contact
		const contactType = emailOrPhone(contact)

		if (contactType === "Unknown") return res.status(400).json({ error: "Please enter a valid email or phone number" })

		req.contactType = contactType
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
