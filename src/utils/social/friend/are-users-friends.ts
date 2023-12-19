import _ from "lodash"
import { Types } from "mongoose"

export default function areUsersFriends (user: User, friendId: Types.ObjectId): boolean {
	try {
		if (_.isEmpty(user.friends)) return false

		return user.friends.some(friend => friend.equals(friendId))

	} catch (error) {
		console.error(error)
		throw new Error("Check if users are friends error")
	}
}
