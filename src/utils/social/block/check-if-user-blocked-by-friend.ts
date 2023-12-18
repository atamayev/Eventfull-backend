import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function checkIfUserBlockedByFriend (userId: Types.ObjectId, friendId: Types.ObjectId): Promise<boolean> {
	try {
		const isUserBlocked = await UserModel.exists({ _id: friendId, blockedUsers: userId })

		return !!isUserBlocked
	} catch (error) {
		console.error(error)
		throw new Error("Check user blocked error")
	}
}
