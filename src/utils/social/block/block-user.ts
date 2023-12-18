import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"
import findUser from "../../find-user"

export default async function blockUser (userId: Types.ObjectId, blockedUserId: Types.ObjectId): Promise<void> {
	try {
		const blockedUser = await findUser(blockedUserId)
		if (_.isNull(blockedUser)) throw new Error("Blocked user not found")

		const userUpdate = UserModel.updateOne(
			{ _id: userId },
			{ $push: { blockedUsers: blockedUserId } }
		)

		const blockedUserUpdate = UserModel.updateOne(
			{ _id: blockedUser },
			{ $push: { blockedByUsers: userId } }
		)

		const [userResult, blockedUserResult] = await Promise.all([userUpdate, blockedUserUpdate])

		if (userResult.matchedCount === 0) throw new Error("User not found")

		if (blockedUserResult.matchedCount === 0) throw new Error("Blocked User not found")
	} catch (error) {
		console.error(error)
		throw new Error("Block another user error")
	}
}
