import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function createOutgoingFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const user = await UserModel.findById(userId)
		if (_.isNull(user)) throw new Error("User not found")

		const friend = await UserModel.findById(friendId)
		if (_.isNull(friend)) throw new Error("Friend not found")

		user.outgoingFriendRequests.push(friendId)
		await user.save()

		friend.incomingFriendRequests.push(userId)
		await friend.save()
	} catch (error) {
		console.error(error)
		throw new Error("Create outgoing friend request error")
	}
}
