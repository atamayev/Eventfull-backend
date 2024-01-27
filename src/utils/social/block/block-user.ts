import UserModel from "../../../models/user-model"

export default async function blockUser (user: User, blockedUser: User): Promise<void> {
	try {
		const userUpdate = UserModel.findByIdAndUpdate(
			user._id,
			{ $push: {
				blockedUsers: {
					userId: blockedUser._id,
					username: blockedUser.username,
				}
			} },
			{ runValidators: true }
		)

		const blockedUserUpdate = UserModel.findByIdAndUpdate(
			blockedUser._id,
			{ $push: {
				blockedByUsers: {
					userId: user._id,
					username: user.username,
				}
			} },
			{ runValidators: true }
		)

		await Promise.all([userUpdate, blockedUserUpdate])
	} catch (error) {
		console.error(error)
		throw new Error("Block another user error")
	}
}
