import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function blockUser (userId: Types.ObjectId, blockedUserId: Types.ObjectId): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			userId,
			{ $push: { blockedUsers: blockedUserId } },
			{ new: true, runValidators: true }
		)

		const blockedUserUpdate = UserModel.findByIdAndUpdate(
			blockedUserId,
			{ $push: { blockedByUsers: userId } },
			{ new: true, runValidators: true }
		)

		const [userResult, blockedUserResult] = await Promise.all([userUpdate, blockedUserUpdate])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(blockedUserResult)) throw new Error("Blocked User not found")
	} catch (error) {
		console.error(error)
		throw new Error("Block another user error")
	}
}
