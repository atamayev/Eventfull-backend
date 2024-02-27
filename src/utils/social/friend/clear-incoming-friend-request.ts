import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function clearIncomingFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { incomingFriendRequests: { userId: friendId } } }, // Adjusted to match the nested structure
			{ runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friendId,
			{ $pull: { outgoingFriendRequests: { userId } } },
			{ runValidators: true }
		)

		await Promise.all([userUpdate, friendUpdate])
	} catch (error) {
		console.error(error)
		throw new Error("Clear Incoming Friend Request error")
	}
}
