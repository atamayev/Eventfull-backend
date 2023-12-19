import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function addLoginHistory(userId: Types.ObjectId): Promise<void> {
	await UserModel.findByIdAndUpdate(
		userId,
		{ $push: { loginHistory: { } } },
		{ runValidators: true }
	)
}
