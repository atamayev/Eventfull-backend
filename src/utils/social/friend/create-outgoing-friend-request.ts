import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"
import SocketManager from "../../../sockets/socket-manager"

export default async function createOutgoingFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			userId,
			{ $push: { outgoingFriendRequests: friendId } },
			{ new: true, runValidators: true }
		)

		const friendUpdate = UserModel.findByIdAndUpdate(
			friendId,
			{ $push: { incomingFriendRequests: userId } },
			{ new: true, runValidators: true }
		)

		const [userResult, friendResult] = await Promise.all([userUpdate, friendUpdate])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(friendResult)) throw new Error("Friend not found")
		SocketManager.getInstance().handleFriendRequest({ fromUserId: userId, toUserId: friendId })
	} catch (error) {
		console.error(error)
		throw new Error("Create outgoing friend request error")
	}
}
