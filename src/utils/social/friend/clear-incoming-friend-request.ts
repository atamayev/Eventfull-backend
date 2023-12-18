import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function clearIncomingFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const friend = await UserModel.findById(friendId)
		if (_.isNull(friend)) throw new Error("Friend not found")

		const userUpdate = UserModel.updateOne(
			{ _id: userId },
			{ $pull: { incomingFriendRequests: friendId } }
		)

		const friendUpdate =  UserModel.updateOne(
			{ _id: friendId },
			{ $pull: { outgoingFriendRequests: userId } }
		)

		const [userResult, friendResult] = await Promise.all([userUpdate, friendUpdate])

		if (userResult.matchedCount === 0) throw new Error("User not found")

		if (friendResult.matchedCount === 0) throw new Error("Friend User not found")
	} catch (error) {
		console.error(error)
		throw new Error("Clear Incoming Friend request error")
	}
}
