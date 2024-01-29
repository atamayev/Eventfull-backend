import _ from "lodash"
import { Types } from "mongoose"
import signJWT from "./sign-jwt"

export default function createAndSignAdminJWT(adminId: Types.ObjectId): string | undefined {
	const stringifiedUserId = _.toString(adminId)
	const token = signJWT({ adminId: stringifiedUserId })
	return token
}
