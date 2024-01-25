import _ from "lodash"
import UserModel from "../../../models/user-model"

export default async function createOutgoingFriendRequest (user: User, friend: User): Promise<void> {
	try {
		// TODO: Add a timestamp when the friend request is sent
		const userUpdate = UserModel.findByIdAndUpdate(
			user._id,
			{ $push: {
				outgoingFriendRequests: {
					userId: friend._id,
					username: friend.username,
				}
			} },
			{ new: true, runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friend._id,
			{ $push: {
				incomingFriendRequests: {
					userId: user._id,
					username: user.username,
				}
			} },
			{ new: true, runValidators: true }
		)

		const [userResult, friendResult] = await Promise.all([userUpdate, friendUpdate])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(friendResult)) throw new Error("Friend not found")
	} catch (error) {
		console.error(error)
		throw new Error("Create outgoing friend request error")
	}
}
