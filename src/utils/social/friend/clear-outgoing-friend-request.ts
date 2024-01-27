import UserModel from "../../../models/user-model"

export default async function clearOutgoingFriendRequest (user: User, friend: User): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			user._id,
			{ $pull: { outgoingFriendRequests: { userId: friend._id } } },
			{ runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friend._id,
			{ $pull: { incomingFriendRequests: {userId: user._id } } },
			{ runValidators: true }
		)

		await Promise.all([userUpdate, friendUpdate])
	} catch (error) {
		console.error(error)
		throw new Error("Clear outgoing friend request error")
	}
}
