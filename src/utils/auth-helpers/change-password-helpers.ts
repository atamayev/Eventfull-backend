import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export async function retrieveUserPassword(userId: Types.ObjectId): Promise<string | undefined> {
	const user = await UserModel.findById(userId)
	if (_.isNull(user)) return undefined
	return user.password
}

export async function updatePassword(userId: Types.ObjectId, newPassword: string): Promise<void> {
	await UserModel.findByIdAndUpdate(userId, { password: newPassword })
}

export async function checkIfUserIdMatchesContact (userId: Types.ObjectId, contact: string, contactType: EmailOrPhone): Promise<boolean> {
	if (contactType === "Email") {
		return await checkIfUserIdMatchesEmail(userId, contact)
	} else {
		return await checkIfUserIdMatchesPhone(userId, contact)
	}
}

async function checkIfUserIdMatchesEmail(userId: Types.ObjectId, email: string): Promise<boolean> {
	const userExists = await UserModel.exists({ _id: userId, email })
	return !!userExists
}

async function checkIfUserIdMatchesPhone(userId: Types.ObjectId, phone: string): Promise<boolean> {
	const userExists = await UserModel.exists({ _id: userId, phone })
	return !!userExists
}
