import { Types, Document } from "mongoose"

export default function isSameContactMethod(
	user: Document<unknown, unknown, User> & User & Required<{_id: Types.ObjectId}>,
	contact: string,
	contactType: EmailOrPhone
): boolean {
	try {
		if (contactType === "Email" && (user.email === contact)) {
			return true
		} else if (contactType === "Phone" && (user.phone === contact)) {
			return true
		}

		return false
	} catch (error) {
		console.error(error)
		return false
	}
}
