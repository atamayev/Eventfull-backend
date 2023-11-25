import { Request, Response } from "express"
import doesContactExist from "../../utils/auth-helpers/does-contact-exist"

// This endpoint will be called as the client types in their email or phone number (in real time)
export default async function checkIfContactExists(req: Request, res: Response): Promise<Response> {
	try {
		const contact = req.body.contact
		const contactType = req.contactType

		const exists = await doesContactExist(contact, contactType)

		return res.status(200).json({ exists })
	} catch (error) {
		console.error(error)
		return res.status(500).json()
	}
}
