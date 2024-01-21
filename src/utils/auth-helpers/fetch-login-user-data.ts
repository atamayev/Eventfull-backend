import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function fetchLoginUserData(user: User): Promise<LoginSocialDataFields> {
	async function fetchUserData(ids: Types.ObjectId[]): Promise<LoginSocialData[]> {
		const results = await Promise.all(ids.map(async (id) => {
			const userData = await UserModel.findById(id).select("_id username")
			return userData ? { userId: userData._id.toString(), username: userData.username } : null
		}))
		results.filter(u => u !== null)
		return results as LoginSocialData[]
	}

	const friends = await fetchUserData(user.friends)
	const incomingFriendRequests = await fetchUserData(user.incomingFriendRequests)
	const outgoingFriendRequests = await fetchUserData(user.outgoingFriendRequests)
	const blockedUsers = await fetchUserData(user.blockedUsers)

	return {
		friends,
		incomingFriendRequests,
		outgoingFriendRequests,
		blockedUsers,
	}
}
