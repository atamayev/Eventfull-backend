import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function unblockUser (userId: Types.ObjectId, blockedUserId: Types.ObjectId): Promise<void> {
	try {
		const user = await UserModel.findById(userId)
		if (_.isNull(user)) throw new Error("User not found")

		const blockedUser = await UserModel.findById(blockedUserId)
		if (_.isNull(blockedUser)) throw new Error("Blocked user not found")

		const userUpdate = UserModel.updateOne(
			{ _id: userId },
			{ $pull: { blockedUsers: blockedUserId } }
		)

		const blockedUserUpdate = UserModel.updateOne(
			{ _id: blockedUser },
			{ $pull: { blockedByUsers: userId } }
		)

		const [userResult, blockedUserResult] = await Promise.all([userUpdate, blockedUserUpdate])

		if (userResult.matchedCount === 0) throw new Error("User not found")

		if (blockedUserResult.matchedCount === 0) throw new Error("Blocked User not found")
	} catch (error) {
		console.error(error)
		throw new Error("Unblock user error")
	}
}
