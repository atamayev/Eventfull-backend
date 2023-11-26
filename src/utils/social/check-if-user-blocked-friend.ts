import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function checkIfUserBlockedFriend (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean> {
	try {
		const isFriendBlocked = await UserModel.exists({ _id: userId, blockedUsers: friendId })

		return !!isFriendBlocked
	} catch (error) {
		console.error(error)
		throw new Error("Check user blocked server error")
	}
}
