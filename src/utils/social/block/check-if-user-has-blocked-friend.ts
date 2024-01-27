import _ from "lodash"
import { Types } from "mongoose"

export default function checkIfUserHasBlockedFriend (user: User, otherUserId: Types.ObjectId): boolean {
	try {
		if (_.isEmpty(user.blockedUsers)) return false

		return user.blockedUsers.some(blockedUser => blockedUser.userId.equals(otherUserId))
	} catch (error) {
		console.error(error)
		throw new Error("Check if user blocked friend server error")
	}
}
