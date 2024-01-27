import { Types } from "mongoose"
import UserModel from "../../../models/user-model"
import NotificationHelper from "../../../classes/notification-helper"

export default async function unfriendYourFriend (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const userDelete = UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { friends: { userId: friendId} } },
			{ runValidators: true }
		)

		const friendDelete = UserModel.findByIdAndUpdate(
			friendId,
			{ $pull: { friends: { userId } } },
			{ runValidators: true }
		)

		await Promise.all([userDelete, friendDelete])

		NotificationHelper.removeFriend(userId, friendId)
	}
	catch (error) {
		console.error(error)
		throw new Error("Unfriend your friend error")
	}
}
