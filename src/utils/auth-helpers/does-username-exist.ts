import AdminModel from "../../models/admin-model"
import UserModel from "../../models/user-model"

export default async function doesUsernameExist(username: string, isAdmin: boolean = false): Promise<boolean>  {
	if (isAdmin === true) {
		const admin = await AdminModel.findOne({
			username: { $regex: `^${username}$`, $options: "i" }
		})
		return admin !== null
	}
	const user = await UserModel.findOne({
		username: { $regex: `^${username}$`, $options: "i" }
	})

	return user !== null
}
