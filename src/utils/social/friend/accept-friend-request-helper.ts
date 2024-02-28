import UserModel from "../../../models/user-model"
import NotificationHelper from "../../../classes/notification-helper"
import clearIncomingFriendRequest from "./clear-incoming-friend-request"

export default async function acceptFriendRequestHelper (
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

		const removeIncomingFrienqRequest = clearIncomingFriendRequest(user._id, friend._id)
		await Promise.all([userUpdate, friendUpdate, removeIncomingFrienqRequest])

		await NotificationHelper.acceptFriendRequest(user, friend, createdAt)
	} catch (error) {
		console.error(error)
		throw new Error("Accept friend request error")
	}
}
