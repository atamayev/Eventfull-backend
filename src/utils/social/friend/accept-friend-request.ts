import _ from "lodash"
import UserModel from "../../../models/user-model"
import NotificationHelper from "../../../classes/notification-helper"

export default async function acceptFriendRequest (user: User, friend: User): Promise<Date> {
	try {
		const now = new Date()
		const userUpdate = UserModel.findByIdAndUpdate(
			user._id,
			{ $push: {
				friends: {
					userId: friend._id,
					username: friend.username,
					createdAt: now,
				}
			} },
			{ new: true, runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friend._id,
			{ $push: {
				friends: {
					userId: user._id,
					username: user.username,
					createdAt: now,
				}
			} },
			{ new: true, runValidators: true }
		)

		const [userResult, friendResult] = await Promise.all([userUpdate, friendUpdate])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(friendResult)) throw new Error("Friend not found")

		await NotificationHelper.acceptFriendRequest(user, friend, now)

		return now
	} catch (error) {
		console.error(error)
		throw new Error("Accept friend request error")
	}
}
