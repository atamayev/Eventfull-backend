import UserModel from "../../../models/user-model"

export default async function createOutgoingFriendRequest (user: User, friend: User): Promise<Date> {
	try {
		const now = new Date()

		const userUpdate = UserModel.findByIdAndUpdate(
			user._id,
			{ $push: {
				outgoingFriendRequests: {
					userId: friend._id,
					username: friend.username,
					createdAt: now,
				}
			} },
			{ runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friend._id,
			{ $push: {
				incomingFriendRequests: {
					userId: user._id,
					username: user.username,
					createdAt: now,
				}
			} },
			{ runValidators: true }
		)

		await Promise.all([userUpdate, friendUpdate])

		return now
	} catch (error) {
		console.error(error)
		throw new Error("Create outgoing friend request error")
	}
}
