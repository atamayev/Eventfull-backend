import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function clearFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const user = await UserModel.findById(userId)
		if (_.isNull(user)) throw new Error("User not found")

		const friend = await UserModel.findById(friendId)
		if (_.isNull(friend)) throw new Error("Friend not found")

		await UserModel.updateOne(
			{ _id: userId },
			{ $pull: { outgoingFriendRequests: friendId } }
		)

		await UserModel.updateOne(
			{ _id: friendId },
			{ $pull: { incomingFriendRequests: userId } }
		)
	} catch (error) {
		console.error(error)
		throw new Error("Create outgoing friend request error")
	}
}
