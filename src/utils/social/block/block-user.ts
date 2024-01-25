import _ from "lodash"
import UserModel from "../../../models/user-model"

export default async function blockUser (userId: User, blockedUser: User): Promise<void> {
	try {
		// TODO: Add what date/time user was blocked to keep track
		const userUpdate = UserModel.findByIdAndUpdate(
			userId,
			{ $push: {
				blockedUsers: {
					userId: blockedUser._id,
					username: blockedUser.username,
				}
			} },
			{ new: true, runValidators: true }
		)

		const blockedUserUpdate = UserModel.findByIdAndUpdate(
			blockedUser._id,
			{ $push: {
				blockedByUsers: {
					userId: userId,
					username: userId.username,
				}
			} },
			{ new: true, runValidators: true }
		)

		const [userResult, blockedUserResult] = await Promise.all([userUpdate, blockedUserUpdate])

		if (_.isNull(userResult)) throw new Error("User not found")

		if (_.isNull(blockedUserResult)) throw new Error("Blocked User not found")
	} catch (error) {
		console.error(error)
		throw new Error("Block another user error")
	}
}
