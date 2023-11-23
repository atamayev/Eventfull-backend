import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export async function retrieveUserIdAndPassword(email: string): Promise<{ userId: Types.ObjectId, password: string } | undefined> {
	const user = await UserModel.findOne({ email, authMethod: "local" })
	if (_.isNull(user)) return undefined

	return {
		userId: user._id,
		password: user.password as string
	}
}
