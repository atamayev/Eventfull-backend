import _ from "lodash"
import { Types } from "mongoose"

export default function checkIfUserBlockedByFriend (user: User, friendId: Types.ObjectId): boolean {
	try {
		if (_.isEmpty(user.blockedByUsers)) return false

		return user.blockedByUsers.some(blockedByUser => blockedByUser.userId.equals(friendId))
	} catch (error) {
		console.error(error)
		throw new Error("Check user blocked error")
	}
}
