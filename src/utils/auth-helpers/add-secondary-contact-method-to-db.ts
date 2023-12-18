import { Types, Document } from "mongoose"
import UserModel from "../../models/user-model"

interface UserFields {
	email?: string
	phone?: string
}

export default async function addSecondaryContactMethodToDb (
	user: Document<unknown, unknown, User> & User & Required<{_id: Types.ObjectId}>,
	contact: string,
	contactType: EmailOrPhone
): Promise<null | void> {
	try {
		if (contactType === user.primaryContactMethod) {
			throw new Error("Cannot replace primary contact")
		}

		const updateFields: UserFields = {}
		if (contactType === "Email") updateFields.email = contact
		else updateFields.phone = contact

		await UserModel.findByIdAndUpdate(user._id, updateFields)
	} catch (error) {
		console.error(error)
		return null
	}
}
