import _ from "lodash"
import { Response, Request } from "express"
import doesContactExist from "../../utils/auth-helpers/does-contact-exist"
import isSameContactMethod from "../../utils/auth-helpers/is-same-contact-method"
import addSecondaryContactMethodToDb from "../../utils/auth-helpers/add-secondary-contact-method-to-db"

export default async function addSecondaryContactMethod (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { contact } = req.body
		const contactType = req.contactType

		const isSameContactMethod1 = isSameContactMethod(user, contact, contactType)
		if (isSameContactMethod1 === true) {
			return res.status(400).json({ message: `This ${contactType} is already associated with your account.` })
		}
		const contactExists = await doesContactExist(contact, contactType)
		if (contactExists === true) {
			return res.status(400).json({ message: `This ${contactType} is already associated with another account.` })
		}

		const response = await addSecondaryContactMethodToDb(user, contact, contactType)
		if (_.isNull(response)) return res.status(400).json({ message: "Cannot change primary contact" })

		return res.status(200).json({ success: `Successfully added ${contactType} to your account`})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to add Secondary Contact Method" })
	}
}
