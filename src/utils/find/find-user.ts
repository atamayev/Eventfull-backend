import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function findUser(userId: Types.ObjectId, select?: string): Promise<User | null> {
	let user
	if (!_.isUndefined(select)) {
		user = await UserModel.findById(userId).select(select)
	} else {
		user = await UserModel.findById(userId)
	}
	return user
}
