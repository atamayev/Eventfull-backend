import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function addLoginHistory(userId: Types.ObjectId): Promise<void> {
	const currentTime = new Date()
	await UserModel.updateOne(
		{ _id: userId },
		{ $push: { loginHistory: currentTime } }
	)
}
