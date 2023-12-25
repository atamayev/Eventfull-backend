import { Request, Response, NextFunction } from "express"
import emailOrPhone from "../../../utils/email-or-phone"

export default function determineChangePasswordContactType (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const contact = req.body.changePasswordObject.contact
		const contactType = emailOrPhone(contact)

		if (contactType === "Unknown") return res.status(400).json({ message: "Please enter a valid Email or Phone Number" })

		req.contactType = contactType
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Determine Contact Type" })
	}
}
