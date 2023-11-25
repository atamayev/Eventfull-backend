import _ from "lodash"
import { Response, Request } from "express"
import { doesContactExist } from "../../utils/auth-helpers/does-contact-exist"
import addSecondaryContactMethodToDb from "../../utils/auth-helpers/add-secondary-contact-method-to-db"

export default async function addSecondaryContactMethod (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const { contact } = req.body
		const contactType = req.contactType

		const contactExists = await doesContactExist(contact, contactType)
		if (contactExists === true) {
			return res.status(400).json({ message: `This ${contactType} is already associated with another account.` })
		}

		const response = await addSecondaryContactMethodToDb(userId, contact, contactType)
		if (_.isNull(response)) return res.status(400).json({ error: "Cannot change primary contact method" })

		return res.status(200).json()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
