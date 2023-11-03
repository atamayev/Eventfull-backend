import UserModel from "../../models/user-model"

export default async function addLoginHistory(userId: string): Promise<void> {
	const currentTime = new Date()
	await UserModel.updateOne(
		{ _id: userId },
		{ $push: { loginHistory: currentTime } }
	)
}
