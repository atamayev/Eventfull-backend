import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function unblockUser (userId: Types.ObjectId, blockedUserId: Types.ObjectId): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { blockedUsers: { userId: blockedUserId } }},
			{ runValidators: true }
		)

		const blockedUserUpdate = UserModel.findByIdAndUpdate(
			blockedUserId,
			{ $pull: { blockedByUsers: { userId } } },
			{ runValidators: true }
		)

		await Promise.all([userUpdate, blockedUserUpdate])
	} catch (error) {
		console.error(error)
		throw new Error("Unblock user error")
	}
}
