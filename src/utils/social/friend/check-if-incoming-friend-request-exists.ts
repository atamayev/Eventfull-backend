import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function checkIfIncomingFriendRequestExists (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean> {
	try {
		const isIncomingFriendRequestExists = await UserModel.exists({ _id: userId, incomingFriendRequests: friendId })

		return !!isIncomingFriendRequestExists
	} catch (error) {
		console.error(error)
		throw new Error("Check if incoming friend exists error")
	}
}
