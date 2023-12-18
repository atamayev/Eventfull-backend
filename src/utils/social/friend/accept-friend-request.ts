import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function acceptFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const friend = await UserModel.findById(friendId)
		if (_.isNull(friend)) throw new Error("Friend not found")

		const userUpdate = UserModel.updateOne(
			{ _id: userId },
			{ $push: { friends: friendId } }
		)

		const friendUpdate = UserModel.updateOne(
			{ _id: friendId },
			{ $push: { friends: userId } }
		)

		const [userResult, friendResult] = await Promise.all([userUpdate, friendUpdate])

		if (userResult.matchedCount === 0) throw new Error("User not found")

		if (friendResult.matchedCount === 0) throw new Error("Friend not found")
	} catch (error) {
		console.error(error)
		throw new Error("Accept friend request error")
	}
}
