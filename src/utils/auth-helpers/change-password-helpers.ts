import _ from "lodash"
import UserModel from "../../models/user-model"

export async function retrieveUserPassword(userId: string): Promise<string | undefined> {
	const user = await UserModel.findById(userId)
	if (_.isNull(user)) return undefined
	return user.password
}

export async function updatePassword(newPassword: string, userId: string): Promise<void> {
	await UserModel.findByIdAndUpdate(userId, { password: newPassword })
}
