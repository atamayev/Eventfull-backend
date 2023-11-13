import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export async function retrieveUserPassword(userId: Types.ObjectId): Promise<string | undefined> {
	const user = await UserModel.findById(userId)
	if (_.isNull(user)) return undefined
	return user.password
}

export async function updatePassword(newPassword: string, userId: Types.ObjectId): Promise<void> {
	await UserModel.findByIdAndUpdate(userId, { password: newPassword })
}
