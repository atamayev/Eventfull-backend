import _ from "lodash"
import { Types } from "mongoose"

export default function checkIfIncomingFriendRequestExists (user: User, friendId: Types.ObjectId): boolean {
	try {
		if (_.isEmpty(user.incomingFriendRequests)) return false

		return user.incomingFriendRequests.some(incomingFriendRequest => incomingFriendRequest.userId.equals(friendId))

	} catch (error) {
		console.error(error)
		throw new Error("Check if incoming friend exists error")
	}
}
