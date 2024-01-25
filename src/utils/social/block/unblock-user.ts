import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function unblockUser (userId: Types.ObjectId, blockedUserId: Types.ObjectId): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { blockedUsers: { userId: blockedUserId } }},
			{ new: true, runValidators: true }
		)

		const blockedUserUpdate = UserModel.findByIdAndUpdate(
			blockedUserId,
			{ $pull: { blockedByUsers: { userId } } },
			{ new: true, runValidators: true }
		)

		const [userResult, blockedUserResult] = await Promise.all([userUpdate, blockedUserUpdate])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(blockedUserResult)) throw new Error("Blocked User not found")
	} catch (error) {
		console.error(error)
		throw new Error("Unblock user error")
	}
}
