import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function unfriendYourFriend (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const userDelete = UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { friends: { userId: friendId} } },
			{ new: true, runValidators: true }
		)

		const friendDelete = UserModel.findByIdAndUpdate(
			friendId,
			{ $pull: { friends: { userId } } },
			{ new: true, runValidators: true }
		)

		const [userResult, friendResult] = await Promise.all([userDelete, friendDelete])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(friendResult)) throw new Error("Friend not found")
	}
	catch (error) {
		console.error(error)
		throw new Error("Unfriend your friend error")
	}
}
