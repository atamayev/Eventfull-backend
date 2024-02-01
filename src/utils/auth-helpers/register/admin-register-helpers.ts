import { Types } from "mongoose"
import AdminModel from "../../../models/admin-model"

export async function addInitialAdminInfo(registerInformation: InitialAdminRegisterInformation): Promise<Types.ObjectId> {
	const { firstName, lastName, email } = registerInformation

	const adminFields = {
		firstName,
		lastName,
		email
	}

	const newUser = await AdminModel.create(adminFields)
	return newUser._id
}

export async function addUsernameAndPassword(adminId: Types.ObjectId, username: string, password: string): Promise<void> {
	await AdminModel.findByIdAndUpdate(adminId, { username, password })
}
