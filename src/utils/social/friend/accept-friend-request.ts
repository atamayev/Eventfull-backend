import UserModel from "../../../models/user-model"
import NotificationHelper from "../../../classes/notification-helper"

export default async function acceptFriendRequest (
	user: User,
	friend: User,
	createdAt: Date
): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			user._id,
			{ $push: {
				friends: {
					userId: friend._id,
					username: friend.username,
					createdAt,
				}
			} },
			{ runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friend._id,
			{ $push: {
				friends: {
					userId: user._id,
					username: user.username,
					createdAt,
				}
			} },
			{ runValidators: true }
		)

		await Promise.all([userUpdate, friendUpdate])

		await NotificationHelper.acceptFriendRequest(user, friend, createdAt)
	} catch (error) {
		console.error(error)
		throw new Error("Accept friend request error")
	}
}
