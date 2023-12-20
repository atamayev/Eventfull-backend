import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function retrieveUserIdAndPassword(
	contact: string,
	contactType: EmailOrPhoneOrUsername
): Promise<{ userId: Types.ObjectId, password: string, source: "local" | "google" | "microsoft" } | undefined> {
	let user = null
	if (contactType === "Email") {
		user = await UserModel.findOne({
			email: { $regex: `^${contact}$`, $options: "i" },
			authMethod: { $in: ["local", "google", "microsoft"] }
		})
	} else if (contactType === "Phone") {
		user = await UserModel.findOne({
			phoneNumber: { $regex: `^${contact}$`, $options: "i" },
			authMethod: { $in: ["local", "google", "microsoft"] }
		})
	} else {
		user = await UserModel.findOne({
			username: { $regex: `^${contact}$`, $options: "i" },
			authMethod: { $in: ["local", "google", "microsoft"] }
		})
	}

	if (_.isNull(user)) return undefined

	return {
		userId: user._id,
		password: user.password as string,
		source: user.authMethod
	}
}
