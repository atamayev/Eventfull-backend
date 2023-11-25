import UserModel from "../../models/user-model"

export default async function doesUsernameExist(username: string): Promise<boolean>  {
	const user = await UserModel.findOne({
		username: { $regex: `^${username}$`, $options: "i" }
	})

	return user !== null
}
