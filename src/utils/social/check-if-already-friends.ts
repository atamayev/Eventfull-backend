import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function checkIfAlreadyFriends (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean> {
	try {
		const isAlreadyFriends = await UserModel.exists({ _id: userId, friends: friendId })

		return !!isAlreadyFriends
	} catch (error) {
		console.error(error)
		throw new Error("Check if already friends error")
	}
}
