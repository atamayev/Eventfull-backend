import UserModel from "../../models/user-model"

interface UserFields {
	email?: string
	phoneNumber?: string
	isPhoneVerified?: boolean
	isEmailVerified?: boolean
}

export default async function addSecondaryContactMethodToDb (user: User, contact: string, contactType: EmailOrPhone): Promise<null | void> {
	try {
		if (contactType === user.primaryContactMethod) {
			throw new Error("Cannot replace primary contact")
		}

		const updateFields: UserFields = {}
		if (contactType === "Email") {
			updateFields.email = contact
			updateFields.isEmailVerified = false
		} else {
			updateFields.phoneNumber = contact
			updateFields.isPhoneVerified = false
		}

		await UserModel.findByIdAndUpdate(user._id, updateFields, { runValidators: true })
	} catch (error) {
		console.error(error)
		return null
	}
}
