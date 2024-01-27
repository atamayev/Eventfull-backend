import _ from "lodash"
import { Types } from "mongoose"

export default function checkIfOutgoingFriendRequestExists (user: User, friendId: Types.ObjectId): boolean {
	try {
		if (_.isEmpty(user.outgoingFriendRequests)) return false

		return user.outgoingFriendRequests.some(outgoingFriendRequest => outgoingFriendRequest.userId.equals(friendId))
	} catch (error) {
		console.error(error)
		throw new Error("Check if outgoing friend request error")
	}
}
