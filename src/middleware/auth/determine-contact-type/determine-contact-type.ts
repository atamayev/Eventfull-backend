import { Request, Response, NextFunction } from "express"
import emailOrPhone from "../../../utils/email-or-phone"

export default function determineContactType (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const contact = req.body.contact as string
		const contactType = emailOrPhone(contact)

		if (contactType === "Unknown") return res.status(400).json({ message: "Please enter a valid Email or Phone Number" })

		req.contactType = contactType
		next()
	} catch (errror) {
		console.error(errror)
		return res.status(500).json({ error: "Internal Server Error: Unable to Determine Contact Type" })
	}
}
