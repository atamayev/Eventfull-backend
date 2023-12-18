import { Types } from "mongoose"
import UserModel from "../models/user-model"

export default async function findUser(userId: Types.ObjectId): Promise<User | null> {
	const user = await UserModel.findById(userId)
	return user as User
}
