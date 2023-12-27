import _ from "lodash"
import { Types } from "mongoose"

export default function createJWTPayload (userId: Types.ObjectId, isNewUser: boolean = false): JwtPayload {
	return {
		userId: _.toString(userId),
		newUser: isNewUser
	}
}
