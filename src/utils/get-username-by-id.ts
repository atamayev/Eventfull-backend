import { Types } from "mongoose"
import UserModel from "../models/user-model"

export default async function getUsernameById(userId: Types.ObjectId): Promise<string> {
	const user = await UserModel.findById(userId)
	return user ? user.username || "Unknown User" : "Unknown User"
}
