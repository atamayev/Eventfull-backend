import { Types } from "mongoose"
import UserModel from "../../models/user-model"
import AdminModel from "../../models/admin-model"

export default async function addLoginRecord(userId: Types.ObjectId, isAdmin: boolean = false): Promise<void> {
	if (isAdmin === true) {
		await AdminModel.findByIdAndUpdate(
			userId,
			{ $push: { loginHistory: { } } },
			{ runValidators: true }
		)
		return
	}
	await UserModel.findByIdAndUpdate(
		userId,
		{ $push: { loginHistory: { } } },
		{ runValidators: true }
	)
}
