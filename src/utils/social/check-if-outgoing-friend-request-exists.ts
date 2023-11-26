import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function checkIfOutgoingFriendRequestExists (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean> {
	try {
		const isOutgoingFriendRequestExists = await UserModel.exists({ _id: userId, outgoingFriendRequests: friendId })

		return !!isOutgoingFriendRequestExists
	} catch (error) {
		console.error(error)
		throw new Error("Check if outgoing friend request error")
	}
}
