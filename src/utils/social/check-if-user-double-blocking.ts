import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function checkIfUserDoubleBlocking (userId: Types.ObjectId, otherUserId: Types.ObjectId): Promise<boolean> {
	try {
		const doesBlockAlreadyExist = await UserModel.exists({ _id: userId, blockedUsers: otherUserId })

		return !!doesBlockAlreadyExist
	} catch (error) {
		console.error(error)
		throw new Error("Check double block server")
	}
}
