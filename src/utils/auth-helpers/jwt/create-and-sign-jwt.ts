import _ from "lodash"
import { Types } from "mongoose"
import signJWT from "./sign-jwt"

export default function createAndSignJWT(userId: Types.ObjectId, isNewUser: boolean = false): string | undefined {
	const stringifiedUserId = _.toString(userId)
	const token = signJWT({ userId: stringifiedUserId, isNewUser })
	return token
}
