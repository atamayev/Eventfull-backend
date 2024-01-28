import { Types } from "mongoose"
import AdminModel from "../../../models/admin-model"

export default async function addAdmin(
	registerInformation: AdminRegisterInformation,
	hashedPassword: string,
): Promise<Types.ObjectId> {
	const { firstName, lastName, username, email } = registerInformation

	const adminFields = {
		firstName,
		lastName,
		username,
		password: hashedPassword,
		email
	}

	const newUser = await AdminModel.create(adminFields)
	return newUser._id
}
