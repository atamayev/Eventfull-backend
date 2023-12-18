import { Types, Document } from "mongoose"

export default function checkIfUserHasContactType (
	user: Document<unknown, unknown, User> & User & Required<{_id: Types.ObjectId}>,
	contact: string,
	contactType: EmailOrPhone
): boolean {
	if (contactType === "Email") return user.email === contact
	else return user.phone === contact
}
