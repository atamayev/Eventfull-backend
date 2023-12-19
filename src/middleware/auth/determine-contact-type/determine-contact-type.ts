import { Request, Response, NextFunction } from "express"
import emailOrPhone from "../../../utils/email-or-phone"

export default function determineContactType (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const contact = req.body.contact as string
		const contactType = emailOrPhone(contact)

		if (contactType === "Unknown") return res.status(400).json({ error: "Please enter a valid email or phone number" })

		req.contactType = contactType
		next()
	} catch (errror) {
		console.error(errror)
		return res.status(500).json({ error: "Internal server error: Unable to Determine Contact Type" })
	}
}
