import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function isSameContactMethod(
	userId: Types.ObjectId,
	contact: string,
	contactType: EmailOrPhone
): Promise<boolean> {
	try {
		const user = await UserModel.findById(userId)
		if (user === null) return false

		if (contactType === "Email" && (user.email === contact)) {
			return true
		}

		else if (contactType === "Phone" && (user.phone === contact)) {
			return true
		}

		return false
	} catch (error) {
		console.error(error)
		return false
	}
}
