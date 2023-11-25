import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

interface UserFields {
	email?: string
	phone?: string
}

export default async function addSecondaryContactMethodToDb (
	userId: Types.ObjectId,
	contact: string,
	contactType: EmailOrPhone
): Promise<null | void> {
	try {
		const user = await UserModel.findById(userId)

		if (_.isNull(user)) throw new Error("User not found")

		if (contactType === user.primaryContactMethod) {
			throw new Error("Cannot replace primary contact")
		}

		const updateFields: UserFields = {}
		if (contactType === "Email") updateFields.email = contact
		else updateFields.phone = contact

		await UserModel.findByIdAndUpdate(userId, updateFields)
	} catch (error) {
		console.error(error)
		return null
	}
}
