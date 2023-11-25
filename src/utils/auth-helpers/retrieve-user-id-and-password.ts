import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function retrieveUserIdAndPassword(
	email: string
): Promise<{ userId: Types.ObjectId, password: string, source: "local" | "google" | "microsoft" } | undefined> {
	const user = await UserModel.findOne({
		email: { $regex: `^${email}$`, $options: "i" },
		authMethod: { $in: ["local", "google", "microsoft"] }
	})

	if (_.isNull(user)) return undefined

	return {
		userId: user._id,
		password: user.password as string,
		source: user.authMethod
	}
}
