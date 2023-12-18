import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function unfriendYourFriend (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const userDelete = UserModel.updateOne(
			{ _id: userId },
			{ $pull: { friends: friendId } }
		)

		const friendDelete = UserModel.updateOne(
			{ _id: friendId },
			{ $pull: { friends: userId } }
		)

		const [userResult, friendResult] = await Promise.all([userDelete, friendDelete])

		if (userResult.matchedCount === 0) throw new Error("User not found")

		if (friendResult.matchedCount === 0) throw new Error("Friend not found")
	}
	catch (error) {
		console.error(error)
		throw new Error("Unfriend your friend error")
	}
}
